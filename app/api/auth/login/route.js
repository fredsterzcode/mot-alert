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
    const { email, password } = await request.json();

    console.log('Login attempt for:', email);

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate password
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
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

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    console.log('Auth response:', { authData: authData ? 'success' : 'failed', authError });

    if (authError) {
      console.error('Auth login error:', authError);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 500 }
      );
    }

    // Get user data from public.users table
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    console.log('User data:', { userData, userError });

    if (userError) {
      console.error('Error getting user data:', userError);
      return NextResponse.json(
        { error: 'Failed to get user data' },
        { status: 500 }
      );
    }

    // Check if user is a partner
    const { data: partner } = await supabaseClient
      .from('partners')
      .select('id, name, company_name, is_active')
      .eq('user_id', authData.user.id)
      .eq('is_active', true)
      .single();

    console.log('Partner data:', partner);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: userData.name,
        phone: userData.phone,
        isVerified: userData.is_verified,
        isPremium: userData.is_premium,
        isPartner: !!partner,
        partner: partner ? {
          id: partner.id,
          name: partner.name,
          companyName: partner.company_name
        } : null
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
} 