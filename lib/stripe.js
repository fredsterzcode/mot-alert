import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null;

/**
 * Create a customer in Stripe
 */
export async function createCustomer(email, name) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'mot-alert'
      }
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

/**
 * Create a subscription
 */
export async function createSubscription(customerId, priceId) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

/**
 * Create a one-time payment
 */
export async function createPaymentIntent(amount, currency = 'gbp', customerId = null) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw error;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Update a subscription
 */
export async function updateSubscription(subscriptionId, updates) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const subscription = await stripe.subscriptions.update(subscriptionId, updates);
    return subscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

/**
 * Create a checkout session
 */
export async function createCheckoutSession(customerId, priceId, successUrl, cancelUrl) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create a payment link
 */
export async function createPaymentLink(priceId, successUrl, cancelUrl) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      after_completion: { type: 'redirect', redirect: { url: successUrl } },
    });
    return paymentLink;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
}

/**
 * Create a customer portal session
 */
export async function createCustomerPortalSession(customerId, returnUrl) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(payload, signature, secret) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

/**
 * Handle webhook events
 */
export async function handleWebhookEvent(event) {
  switch (event.type) {
    case 'customer.subscription.created':
      // Handle subscription creation
      console.log('Subscription created:', event.data.object.id);
      break;
    
    case 'customer.subscription.updated':
      // Handle subscription updates
      console.log('Subscription updated:', event.data.object.id);
      break;
    
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      console.log('Subscription cancelled:', event.data.object.id);
      break;
    
    case 'invoice.payment_succeeded':
      // Handle successful payment
      console.log('Payment succeeded:', event.data.object.id);
      break;
    
    case 'invoice.payment_failed':
      // Handle failed payment
      console.log('Payment failed:', event.data.object.id);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Get customer details
 */
export async function getCustomer(customerId) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
}

/**
 * Update customer details
 */
export async function updateCustomer(customerId, updates) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const customer = await stripe.customers.update(customerId, updates);
    return customer;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

/**
 * Create a refund
 */
export async function createRefund(paymentIntentId, amount = null) {
  try {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount, // Optional: partial refund
    });
    return refund;
  } catch (error) {
    console.error('Error creating refund:', error);
    throw error;
  }
} 