import { NextResponse } from 'next/server';
import { getSubscription, updateSubscription } from '@/lib/stripe';
import { getUserByEmail } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email, newPlanType, subscriptionId } = await request.json();

    if (!email || !newPlanType || !subscriptionId) {
      return NextResponse.json(
        { error: 'Email, new plan type, and subscription ID are required' },
        { status: 400 }
      );
    }

    // Get price ID for new plan
    const priceIds = {
      'premium': process.env.STRIPE_PREMIUM_PRICE_ID,
      'whitelabel': process.env.STRIPE_WHITELABEL_PRICE_ID,
      'api_premium': process.env.STRIPE_API_PREMIUM_PRICE_ID,
      'api_enterprise': process.env.STRIPE_API_ENTERPRISE_PRICE_ID
    };

    const newPriceId = priceIds[newPlanType];
    if (!newPriceId) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Get current subscription
    const currentSubscription = await getSubscription(subscriptionId);
    
    // Get the current subscription item ID
    const currentItemId = currentSubscription.items.data[0].id;

    // Update subscription with new price
    const updatedSubscription = await updateSubscription(subscriptionId, {
      items: [{
        id: currentItemId,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations', // or 'none', 'always_invoice'
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription upgraded successfully',
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        currentPeriodStart: updatedSubscription.current_period_start,
        currentPeriodEnd: updatedSubscription.current_period_end,
        items: updatedSubscription.items.data.map(item => ({
          priceId: item.price.id,
          quantity: item.quantity
        }))
      }
    });

  } catch (error) {
    console.error('Subscription upgrade error:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade subscription', details: error.message },
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

    // Get subscription details
    const subscription = await getSubscription(subscriptionId);

    // Determine current plan type
    const priceId = subscription.items.data[0].price.id;
    const planTypes = {
      [process.env.STRIPE_PREMIUM_PRICE_ID]: 'premium',
      [process.env.STRIPE_WHITELABEL_PRICE_ID]: 'whitelabel',
      [process.env.STRIPE_API_PREMIUM_PRICE_ID]: 'api_premium',
      [process.env.STRIPE_API_ENTERPRISE_PRICE_ID]: 'api_enterprise'
    };

    const currentPlan = planTypes[priceId] || 'unknown';

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPlan,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    });

  } catch (error) {
    console.error('Subscription details error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription details', details: error.message },
      { status: 500 }
    );
  }
} 