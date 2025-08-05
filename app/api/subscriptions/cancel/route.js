import { NextResponse } from 'next/server';
import { cancelSubscription, getSubscription } from '@/lib/stripe';
import { updateSubscriptionStatus } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Cancel subscription in Stripe
    const cancelledSubscription = await cancelSubscription(subscriptionId);

    // Update subscription status in database
    await updateSubscriptionStatus(subscriptionId, 'cancelled');

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        id: cancelledSubscription.id,
        status: cancelledSubscription.status,
        cancelAtPeriodEnd: cancelledSubscription.cancel_at_period_end
      }
    });

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Get subscription details from Stripe
    const subscription = await getSubscription(subscriptionId);

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        items: subscription.items.data.map(item => ({
          priceId: item.price.id,
          quantity: item.quantity
        }))
      }
    });

  } catch (error) {
    console.error('Subscription retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription', details: error.message },
      { status: 500 }
    );
  }
} 