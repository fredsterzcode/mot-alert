import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserByEmail, updateUser } from '@/lib/supabase';

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
    const { email, name, phone, userType = 'free' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Check if user already exists
    const { data: existingUser } = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user
    const { data: user, error } = await supabaseClient
      .from('users')
      .insert({
        email,
        name,
        phone,
        is_partner: userType === 'partner',
        is_premium: userType === 'premium',
        is_verified: false
      })
      .select()
      .single();

    if (error) {
      console.error('User creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create user', details: error.message },
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
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isPartner: user.is_partner,
        isPremium: user.is_premium
      }
    });

  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isVerified: user.is_verified,
        isPremium: user.is_premium,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('User retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to get user', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updatedUser = await updateUser(id, updates);

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        isVerified: updatedUser.is_verified,
        isPremium: updatedUser.is_premium,
        updatedAt: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
} 