import Stripe from 'stripe';
import { Request, Response } from 'express';
import { z } from 'zod';
import { storage } from './storage';

// Initialize Stripe with secret key (will be loaded from environment)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '') as any;

// Schema for creating payment intent
const createPaymentIntentSchema = z.object({
  amount: z.number().min(100), // Minimum $1 in cents
  currency: z.string().default('brl'),
  campaignId: z.number().optional(),
  metadata: z.object({
    donorName: z.string(),
    donorEmail: z.string().email(),
    donorPhone: z.string().optional(),
    message: z.string().optional(),
  }),
});

// Schema for confirming payment
const confirmPaymentSchema = z.object({
  paymentIntentId: z.string(),
  paymentMethodId: z.string(),
});

export async function createPaymentIntent(req: Request, res: Response) {
  try {
    // Validate request body
    const body = createPaymentIntentSchema.parse(req.body);

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ 
        error: 'Payment system not configured. Please contact support.' 
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount,
      currency: body.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...body.metadata,
        campaignId: body.campaignId?.toString() || '',
      },
    });

    // Return client secret for frontend
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
}

export async function confirmPayment(req: Request, res: Response) {
  try {
    const body = confirmPaymentSchema.parse(req.body);

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ 
        error: 'Payment system not configured. Please contact support.' 
      });
    }

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(body.paymentIntentId);

    // Check if payment was successful
    if (paymentIntent.status === 'succeeded') {
      // Create donation record in database
      const donation = await storage.createDonation({
        amount: (paymentIntent.amount / 100).toString(), // Convert from cents to currency units as string
        currency: paymentIntent.currency,
        donorName: paymentIntent.metadata.donorName || 'Anonymous',
        donorEmail: paymentIntent.metadata.donorEmail || '',
        campaignId: paymentIntent.metadata.campaignId ? parseInt(paymentIntent.metadata.campaignId) : undefined,
        type: 'one-time',
        status: 'completed',
        paymentMethod: 'stripe',
        transactionId: paymentIntent.id,
        notes: paymentIntent.metadata.message || undefined,
      });

      // Update campaign raised amount if applicable
      if (donation.campaignId) {
        await storage.updateCampaignRaised(donation.campaignId, parseFloat(donation.amount));
      }

      res.json({ 
        success: true, 
        donation,
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url 
      });
    } else {
      res.status(400).json({ 
        error: 'Payment not completed', 
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
}

// Webhook handler for Stripe events
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      // Additional processing can be added here
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

// Get Stripe publishable key
export async function getStripeConfig(req: Request, res: Response) {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    isConfigured: !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_PUBLISHABLE_KEY,
  });
}