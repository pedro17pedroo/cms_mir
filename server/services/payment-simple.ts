import Stripe from 'stripe';
import { storage } from '../storage';
import type { InsertDonation } from '@shared/schema';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface DonationData {
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  campaignId?: number;
  message?: string;
}

export class PaymentService {
  private stripe: Stripe;

  constructor() {
    // Initialize Stripe with a safe fallback
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
  }

  /**
   * Create a payment intent for donation processing
   */
  async createPaymentIntent(donationData: DonationData): Promise<PaymentIntent> {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      throw new Error('Stripe secret key not configured. Please configure STRIPE_SECRET_KEY environment variable.');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(donationData.amount * 100), // Convert to cents
        currency: donationData.currency || 'eur',
        metadata: {
          donorName: donationData.donorName,
          donorEmail: donationData.donorEmail,
          campaignId: donationData.campaignId?.toString() || '',
          message: donationData.message || '',
        },
        receipt_email: donationData.donorEmail,
      });

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Confirm payment and create donation record
   */
  async confirmPayment(paymentIntentId: string): Promise<void> {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      throw new Error('Stripe secret key not configured');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Create donation record in database
        const donationData: InsertDonation = {
          amount: (paymentIntent.amount / 100).toString(), // Convert back from cents to string
          currency: paymentIntent.currency || 'eur',
          donorName: paymentIntent.metadata?.donorName || 'Anonymous',
          donorEmail: paymentIntent.metadata?.donorEmail || '',
          campaignId: paymentIntent.metadata?.campaignId ? parseInt(paymentIntent.metadata.campaignId) : undefined,
          status: 'completed',
          type: 'one-time',
          paymentMethod: 'stripe',
          transactionId: paymentIntent.id,
          notes: paymentIntent.metadata?.message || undefined,
        };

        const donation = await storage.createDonation(donationData);

        // Update campaign raised amount if applicable
        if (donation.campaignId) {
          await storage.updateCampaignRaised(donation.campaignId, parseFloat(donation.amount));
        }
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  /**
   * Handle Stripe webhooks for payment confirmation
   */
  async handleWebhook(payload: string, signature: string): Promise<void> {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      console.warn('Stripe webhook secret not configured');
      return;
    }

    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.confirmPayment(event.data.object.id);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw new Error('Webhook signature verification failed');
    }
  }

  /**
   * Get Stripe publishable key for client-side
   */
  getPublishableKey(): string {
    return process.env.STRIPE_PUBLISHABLE_KEY || '';
  }

  /**
   * Check if Stripe is properly configured
   */
  isConfigured(): boolean {
    return !!(process.env.STRIPE_SECRET_KEY && 
              process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder' &&
              process.env.STRIPE_PUBLISHABLE_KEY);
  }
}

export const paymentService = new PaymentService();