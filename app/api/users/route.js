import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserByEmail, updateUser } from '@/lib/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { 
      name, 
      email, 
      phone, 
      userType = 'individual',
      companyName,
      companyDescription,
      website
    } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check phone number uniqueness (if provided)
    if (phone) {
      const { data: existingPhone } = await supabase
        .from('users')
        .select('id')
        .eq('phone', phone)
        .single();

      if (existingPhone) {
        return NextResponse.json(
          { error: 'Phone number already registered to another account' },
          { status: 400 }
        );
      }
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        phone,
        is_verified: false,
        is_premium: false,
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

    // If user is a partner, create partner record
    if (userType === 'partner') {
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

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.is_verified,
        isPremium: user.is_premium,
        isPartner: userType === 'partner'
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