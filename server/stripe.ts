import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function createPaymentIntent(amount: number, currency: string = 'brl', metadata?: any) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: ['card'],
      metadata: metadata || {},
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function confirmPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
}

export async function createCheckoutSession(
  amount: number,
  campaignTitle: string,
  campaignId: number,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Doação - ${campaignTitle}`,
              description: `Contribuição para a campanha: ${campaignTitle}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        campaignId: campaignId.toString(),
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function handleWebhook(body: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    return event;
  } catch (error) {
    console.error('Error verifying webhook:', error);
    throw error;
  }
}

export { stripe };