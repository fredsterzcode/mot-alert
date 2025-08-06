import { NextResponse } from 'next/server';
import { createCustomer, createCheckoutSession } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase client
let supabase = null;

const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not configured');
      return null;
    }
    
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};

export async function POST(request) {
  try {
    const { 
      email, 
      password,
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

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if user exists in auth.users
    let user = null;
    
    // If password is provided, create new user with Supabase Auth
    if (password) {
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            user_type: planType === 'premium' ? 'premium' : 'partner'
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return NextResponse.json(
          { error: authError.message },
          { status: 400 }
        );
      }

      if (!authData.user) {
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        );
      }

      user = authData.user;
    } else {
      // For existing users, try to get from auth.users
      const { data: { users }, error } = await supabaseClient.auth.admin.listUsers();
      if (!error) {
        user = users.find(u => u.email === email);
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found or failed to create' },
        { status: 404 }
      );
    }

    // If creating a partner, create partner record
    if (planType === 'whitelabel') {
      const { error: partnerError } = await supabaseClient
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
      
      // Update user permissions for partner
      await supabaseClient
        .from('users')
        .update({ 
          is_premium: true,
          is_partner: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    } else if (planType === 'premium') {
      // Update user permissions for premium
      await supabaseClient
        .from('users')
        .update({ 
          is_premium: true,
          is_partner: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    }
    
    // Create or get Stripe customer
    let customerId;
    const { data: userData } = await supabaseClient
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userData && userData.stripe_customer_id) {
      customerId = userData.stripe_customer_id;
    } else {
      const customer = await createCustomer(email, name);
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await supabaseClient
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
    if (password) {
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