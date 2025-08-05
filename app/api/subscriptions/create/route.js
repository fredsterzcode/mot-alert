import { NextResponse } from 'next/server';
import { createCustomer, createCheckoutSession } from '@/lib/stripe';
import { getUserByEmail } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email, name, planType } = await request.json();

    if (!email || !planType) {
      return NextResponse.json(
        { error: 'Email and plan type are required' },
        { status: 400 }
      );
    }

    // Get price ID based on plan type
    const priceIds = {
      'premium': process.env.STRIPE_PREMIUM_PRICE_ID,
      'whitelabel': process.env.STRIPE_WHITELABEL_PRICE_ID,
      'api_premium': process.env.STRIPE_API_PREMIUM_PRICE_ID,
      'api_enterprise': process.env.STRIPE_API_ENTERPRISE_PRICE_ID
    };

    const priceId = priceIds[planType];
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await getUserByEmail(email);
    
    // Create or get Stripe customer
    let customerId;
    if (user && user.stripe_customer_id) {
      customerId = user.stripe_customer_id;
    } else {
      const customer = await createCustomer(email, name);
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      if (user) {
        // Update existing user
        // You'll need to implement updateUser function
      }
    }

    // Create checkout session
    const session = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/cancel`
    );

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription', details: error.message },
      { status: 500 }
    );
  }
} 