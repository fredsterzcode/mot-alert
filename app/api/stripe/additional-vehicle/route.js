import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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
    const { userId, subscriptionId, quantity = 1, isPartner = false, autoRenew = false } = await request.json();

    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: 'User ID and subscription ID are required' },
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

    // Get user details
    const { data: user } = await supabaseClient
      .from('users')
      .select('email, name, is_partner')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate price based on user type
    const isPartnerUser = isPartner || user.is_partner;
    const unitPrice = isPartnerUser ? 299 : 999; // £2.99 for partners, £9.99 for regular users
    const totalAmount = unitPrice * quantity;

    // Create Stripe payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: totalAmount,
      currency: 'gbp',
      metadata: {
        userId,
        subscriptionId,
        addonType: 'vehicle',
        quantity: quantity.toString(),
        isPartner: isPartnerUser.toString(),
        autoRenew: autoRenew.toString()
      },
      description: `${quantity} additional vehicle${quantity > 1 ? 's' : ''} for MOT Alert (${isPartnerUser ? 'Partner' : 'Premium'} rate) - ${autoRenew ? 'Auto-renewal enabled' : 'One-time payment'}`,
      receipt_email: user.email
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      unitPrice: unitPrice / 100, // Return price in pounds for display
      isPartner: isPartnerUser,
      autoRenew
    });

  } catch (error) {
    console.error('Additional vehicle payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: error.message },
      { status: 500 }
    );
  }
}

// Handle successful payment
export async function PUT(request) {
  try {
    const { paymentIntentId, userId, subscriptionId, quantity = 1, isPartner = false, autoRenew = false } = await request.json();

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

    // Verify payment intent
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Calculate expiry date (1 year from now)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Create subscription addon record
    const { data: addon, error: addonError } = await supabaseClient
      .from('subscription_addons')
      .insert({
        subscription_id: subscriptionId,
        user_id: userId,
        addon_type: 'vehicle',
        quantity: quantity,
        stripe_payment_intent_id: paymentIntentId,
        price_paid: (paymentIntent.amount / 100).toFixed(2),
        expires_at: expiresAt.toISOString().split('T')[0],
        is_active: true,
        is_partner_addon: isPartner,
        auto_renew: autoRenew,
        next_renewal_date: autoRenew ? expiresAt.toISOString().split('T')[0] : null
      })
      .select()
      .single();

    if (addonError) {
      console.error('Addon creation error:', addonError);
      return NextResponse.json(
        { error: 'Failed to create addon record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Additional vehicles added successfully',
      addon: {
        id: addon.id,
        quantity: addon.quantity,
        expiresAt: addon.expires_at,
        isPartner: isPartner,
        autoRenew: autoRenew,
        nextRenewalDate: addon.next_renewal_date
      }
    });

  } catch (error) {
    console.error('Addon creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

// Handle auto-renewal
export async function PATCH(request) {
  try {
    const { addonId, autoRenew } = await request.json();

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Update addon auto-renewal setting
    const { data: addon, error: updateError } = await supabaseClient
      .from('subscription_addons')
      .update({
        auto_renew: autoRenew,
        next_renewal_date: autoRenew ? new Date().toISOString().split('T')[0] : null
      })
      .eq('id', addonId)
      .select()
      .single();

    if (updateError) {
      console.error('Addon update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update addon' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Auto-renewal ${autoRenew ? 'enabled' : 'disabled'} successfully`,
      addon: {
        id: addon.id,
        autoRenew: addon.auto_renew,
        nextRenewalDate: addon.next_renewal_date
      }
    });

  } catch (error) {
    console.error('Auto-renewal update error:', error);
    return NextResponse.json(
      { error: 'Failed to update auto-renewal setting' },
      { status: 500 }
    );
  }
} 