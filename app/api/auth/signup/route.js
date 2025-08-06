import { NextResponse } from 'next/server';
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
    const { email, password, name, phone, userType = 'free' } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
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

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          user_type: userType
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

    // Send welcome email
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
        console.warn('Welcome email failed to send, but user was created');
      }
    } catch (emailError) {
      console.warn('Welcome email error:', emailError);
      // Don't fail the signup if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully. Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
        phone,
        userType
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}
