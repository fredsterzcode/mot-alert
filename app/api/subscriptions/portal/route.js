import { NextResponse } from 'next/server';
import { createCustomerPortalSession } from '@/lib/stripe';
import { getUserByEmail } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserByEmail(email);
    if (!user || !user.stripe_customer_id) {
      return NextResponse.json(
        { error: 'User not found or no subscription' },
        { status: 404 }
      );
    }

    // Create customer portal session
    const session = await createCustomerPortalSession(
      user.stripe_customer_id,
      `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
    );

    return NextResponse.json({
      success: true,
      url: session.url
    });

  } catch (error) {
    console.error('Customer portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer portal session', details: error.message },
      { status: 500 }
    );
  }
} 