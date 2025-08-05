import { NextResponse } from 'next/server';
import { getCustomer, getSubscription, updateCustomer } from '@/lib/stripe';
import { getUserByEmail } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

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

    // Get customer details from Stripe
    const customer = await getCustomer(user.stripe_customer_id);
    
    // Get all subscriptions for this customer
    const subscriptions = customer.subscriptions?.data || [];

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        created: customer.created
      },
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        status: sub.status,
        currentPeriodStart: sub.current_period_start,
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        items: sub.items.data.map(item => ({
          priceId: item.price.id,
          quantity: item.quantity
        }))
      }))
    });

  } catch (error) {
    console.error('Subscription management error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription details', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { email, updates } = await request.json();

    if (!email || !updates) {
      return NextResponse.json(
        { error: 'Email and updates are required' },
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

    // Update customer in Stripe
    const updatedCustomer = await updateCustomer(user.stripe_customer_id, updates);

    return NextResponse.json({
      success: true,
      customer: {
        id: updatedCustomer.id,
        email: updatedCustomer.email,
        name: updatedCustomer.name,
        updated: true
      }
    });

  } catch (error) {
    console.error('Customer update error:', error);
    return NextResponse.json(
      { error: 'Failed to update customer', details: error.message },
      { status: 500 }
    );
  }
} 