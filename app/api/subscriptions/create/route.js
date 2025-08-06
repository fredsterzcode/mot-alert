import { NextResponse } from 'next/server';
import { createCustomer, createCheckoutSession } from '@/lib/stripe';
import { getUserByEmail } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { 
      email, 
      name, 
      planType, 
      phone,
      companyName,
      companyDescription,
      website
    } = await request.json();

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
    
    // Create user if doesn't exist
    if (!user) {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          name,
          email,
          phone,
          is_verified: false,
          is_premium: planType === 'premium',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (userError) {
        return NextResponse.json(
          { error: 'Failed to create user', details: userError.message },
          { status: 500 }
        );
      }

      user = newUser;

      // If creating a partner, create partner record
      if (planType === 'whitelabel') {
        const { error: partnerError } = await supabase
          .from('partners')
          .insert({
            user_id: user.id,
            name: name,
            company_name: companyName || name,
            contact_email: email,
            phone: phone,
            company_description: companyDescription,
            website_url: website,
            is_active: true,
            plan_type: 'BASIC',
            commission_rate: 0.00,
            created_at: new Date().toISOString()
          });

        if (partnerError) {
          console.error('Partner creation error:', partnerError);
          // Don't fail the signup if partner creation fails
        }
      }
    }
    
    // Create or get Stripe customer
    let customerId;
    if (user.stripe_customer_id) {
      customerId = user.stripe_customer_id;
    } else {
      const customer = await createCustomer(email, name);
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create checkout session
    const session = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/signup?error=payment_cancelled`
    );

    // Send welcome email for new users
    if (!user.stripe_customer_id) {
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            userName: name,
            type: 'welcome',
            vehicleReg: 'N/A', // Will be set when they add their first vehicle
            dueDate: new Date().toISOString().split('T')[0]
          }),
        });

        if (!emailResponse.ok) {
          console.warn('Welcome email failed to send, but subscription was created');
        }
      } catch (emailError) {
        console.warn('Welcome email error:', emailError);
        // Don't fail the signup if email fails
      }
    }

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