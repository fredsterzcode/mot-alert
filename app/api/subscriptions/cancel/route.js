import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Lazy initialization of Stripe client
let stripe = null;

const getStripeClient = () => {
  if (!stripe) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.warn('Stripe secret key not configured');
      return null;
    }
    
    stripe = new Stripe(stripeSecretKey);
  }
  return stripe;
};

// Lazy initialization of Supabase client
let supabase = null;

const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Supabase environment variables not configured');
      return null;
    }
    
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabase;
};

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { subscriptionId, addonId, cancelType } = await request.json();

    if (!subscriptionId || !cancelType) {
      return NextResponse.json(
        { error: 'Subscription ID and cancel type are required' },
        { status: 400 }
      );
    }

    const stripeClient = getStripeClient();
    const supabaseClient = getSupabaseClient();
    
    if (!stripeClient) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }
    
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Ensure user can only cancel their own subscriptions
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found or unauthorized' },
        { status: 404 }
      );
    }

    if (cancelType === 'subscription') {
      // Cancel the main subscription
      try {
        await stripeClient.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true
        });

        // Update subscription status in database
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString()
          })
          .eq('id', subscriptionId);

        if (updateError) {
          console.error('Error updating subscription:', updateError);
        }

        return NextResponse.json({
          success: true,
          message: 'Subscription will be cancelled at the end of the current billing period'
        });

      } catch (stripeError) {
        console.error('Stripe cancellation error:', stripeError);
        return NextResponse.json(
          { error: 'Failed to cancel subscription' },
          { status: 500 }
        );
      }

    } else if (cancelType === 'addon') {
      // Cancel addon auto-renewal
      if (!addonId) {
        return NextResponse.json(
          { error: 'Addon ID is required for addon cancellation' },
          { status: 400 }
        );
      }

      const { data: addon, error: addonError } = await supabaseClient
        .from('subscription_addons')
        .select('*')
        .eq('id', addonId)
        .eq('subscription_id', subscriptionId)
        .single();

      if (addonError || !addon) {
        return NextResponse.json(
          { error: 'Addon not found' },
          { status: 404 }
        );
      }

      // Disable auto-renewal for the addon
      const { error: updateError } = await supabaseClient
        .from('subscription_addons')
        .update({
          auto_renew: false,
          next_renewal_date: null
        })
        .eq('id', addonId);

      if (updateError) {
        console.error('Error updating addon:', updateError);
        return NextResponse.json(
          { error: 'Failed to cancel addon auto-renewal' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Addon auto-renewal cancelled successfully'
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid cancel type' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

// Get cancellation options
export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get subscription and addons
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    const { data: addons } = await supabaseClient
      .from('subscription_addons')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .eq('is_active', true);

    return NextResponse.json({
      success: true,
      subscription,
      addons: addons || []
    });

  } catch (error) {
    console.error('Get cancellation options error:', error);
    return NextResponse.json(
      { error: 'Failed to get cancellation options' },
      { status: 500 }
    );
  }
} 