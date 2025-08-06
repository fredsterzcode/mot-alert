import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // Get active vehicle addons
    const { data: addons } = await supabase
      .from('subscription_addons')
      .select('quantity, expires_at')
      .eq('user_id', userId)
      .eq('addon_type', 'vehicle')
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString().split('T')[0]);

    // Calculate base limit
    let baseLimit = 1; // Free plan
    if (subscription?.plan_type === 'PREMIUM') {
      baseLimit = 3;
    }

    // Calculate additional vehicles from addons
    let additionalVehicles = 0;
    if (addons) {
      additionalVehicles = addons.reduce((total, addon) => {
        return total + addon.quantity;
      }, 0);
    }

    const totalLimit = baseLimit + additionalVehicles;

    return NextResponse.json({
      success: true,
      limits: {
        baseLimit,
        additionalVehicles,
        totalLimit
      },
      subscription: subscription || { plan_type: 'FREE', status: 'active' },
      addons: addons || []
    });

  } catch (error) {
    console.error('Vehicle limit calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate vehicle limit' },
      { status: 500 }
    );
  }
} 