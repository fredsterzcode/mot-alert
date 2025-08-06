import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/supabase';
import { generateSessionToken } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // TODO: Add proper password validation here
    // For now, we'll accept any password for testing

    // Check if user is a partner
    const { data: partner } = await supabase
      .from('partners')
      .select('id, name, company_name, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    // Generate session token
    const token = generateSessionToken(user.id);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isVerified: user.is_verified,
        isPremium: user.is_premium,
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