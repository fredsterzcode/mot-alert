import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, updateUser } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/resend-email';

export async function POST(request) {
  try {
    const { email, name, phone } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await createUser(email, name, phone);

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name || 'there', 'Your Vehicle');
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
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
        isVerified: user.is_verified,
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