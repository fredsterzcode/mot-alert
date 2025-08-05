import { NextResponse } from 'next/server';
import { verifyWebhookSignature, handleWebhookEvent } from '@/lib/stripe';
import { updateSubscriptionStatus } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Stripe not configured for webhooks');
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the webhook event
    await handleWebhookEvent(event);

    // Update our database based on event type
    switch (event.type) {
      case 'customer.subscription.created':
        // Update user to premium
        const subscription = event.data.object;
        await updateSubscriptionStatus(
          subscription.id,
          'active'
        );
        break;

      case 'customer.subscription.updated':
        // Update subscription status
        const updatedSubscription = event.data.object;
        await updateSubscriptionStatus(
          updatedSubscription.id,
          updatedSubscription.status
        );
        break;

      case 'customer.subscription.deleted':
        // Cancel subscription
        const cancelledSubscription = event.data.object;
        await updateSubscriptionStatus(
          cancelledSubscription.id,
          'cancelled'
        );
        break;

      case 'invoice.payment_succeeded':
        // Handle successful payment
        console.log('Payment succeeded for subscription:', event.data.object.subscription);
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed for subscription:', event.data.object.subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
} 