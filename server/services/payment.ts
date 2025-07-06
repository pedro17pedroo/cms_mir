import Stripe from 'stripe';
import { storage } from '../storage';
import type { InsertDonation } from '@shared/schema';

// Initialize Stripe - using latest stable API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

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
  isRecurring?: boolean;
  recurringInterval?: 'monthly' | 'quarterly' | 'annually';
  message?: string;
}

export class PaymentService {
  /**
   * Create a payment intent for donation processing
   */
  async createPaymentIntent(donationData: DonationData): Promise<PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(donationData.amount * 100), // Convert to cents
        currency: donationData.currency || 'eur',
        metadata: {
          donorName: donationData.donorName,
          donorEmail: donationData.donorEmail,
          campaignId: donationData.campaignId?.toString() || '',
          isRecurring: donationData.isRecurring?.toString() || 'false',
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
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Create donation record in database
        const donationData: InsertDonation = {
          amount: paymentIntent.amount / 100, // Convert back from cents
          currency: paymentIntent.currency,
          donorName: paymentIntent.metadata?.donorName || 'Anonymous',
          donorEmail: paymentIntent.metadata?.donorEmail || '',
          campaignId: paymentIntent.metadata?.campaignId ? parseInt(paymentIntent.metadata.campaignId) : undefined,
          status: 'completed',
          paymentIntentId: paymentIntent.id,
          message: paymentIntent.metadata?.message || undefined,
        };

        const donation = await storage.createDonation(donationData);

        // Update campaign raised amount if applicable
        if (donation.campaignId) {
          await storage.updateCampaignRaised(donation.campaignId, donation.amount);
        }
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  /**
   * Create recurring donation subscription
   */
  async createRecurringDonation(donationData: DonationData): Promise<{ subscriptionId: string; clientSecret: string }> {
    try {
      // Create customer
      const customer = await stripe.customers.create({
        email: donationData.donorEmail,
        name: donationData.donorName,
        metadata: {
          campaignId: donationData.campaignId?.toString() || '',
        },
      });

      // Create product for donation
      const product = await stripe.products.create({
        name: 'Church Donation',
        description: donationData.message || 'Recurring church donation',
      });

      // Create price for recurring payment
      const price = await stripe.prices.create({
        unit_amount: Math.round(donationData.amount * 100),
        currency: donationData.currency || 'eur',
        recurring: {
          interval: donationData.recurringInterval || 'monthly',
        },
        product: product.id,
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

      return {
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('Error creating recurring donation:', error);
      throw new Error('Failed to create recurring donation');
    }
  }

  /**
   * Handle Stripe webhooks for payment confirmation
   */
  async handleWebhook(payload: string, signature: string): Promise<void> {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    try {
      const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.confirmPayment(event.data.object.id);
          break;
        case 'invoice.payment_succeeded':
          await this.handleRecurringPayment(event.data.object as Stripe.Invoice);
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
   * Handle recurring payment success
   */
  private async handleRecurringPayment(invoice: Stripe.Invoice): Promise<void> {
    try {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;

      const donationData: InsertDonation = {
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        donorName: customer.name || 'Anonymous',
        donorEmail: customer.email || '',
        campaignId: customer.metadata.campaignId ? parseInt(customer.metadata.campaignId) : undefined,
        status: 'completed',
        paymentIntentId: invoice.payment_intent as string,
        subscriptionId: subscription.id,
        isRecurring: true,
      };

      const donation = await storage.createDonation(donationData);

      // Update campaign raised amount if applicable
      if (donation.campaignId) {
        await storage.updateCampaignRaised(donation.campaignId, donation.amount);
      }
    } catch (error) {
      console.error('Error handling recurring payment:', error);
    }
  }

  /**
   * Get payment methods for customer
   */
  async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  }

  /**
   * Cancel recurring donation subscription
   */
  async cancelRecurringDonation(subscriptionId: string): Promise<void> {
    try {
      await stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel recurring donation');
    }
  }
}

export const paymentService = new PaymentService();