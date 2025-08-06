import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

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

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get user's subscription
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // Get current vehicle count
    const { count: vehicleCount } = await supabaseClient
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Determine limits based on plan
    let vehicleLimit;
    let planType = 'FREE';

    if (subscription) {
      planType = subscription.plan_type;
      switch (planType) {
        case 'PREMIUM':
          vehicleLimit = 3;
          break;
        case 'WHITELABEL':
          vehicleLimit = 100;
          break;
        case 'ENTERPRISE':
          vehicleLimit = 1000;
          break;
        default:
          vehicleLimit = 1;
      }
    } else {
      vehicleLimit = 1; // Free plan
    }

    return NextResponse.json({
      success: true,
      limit: vehicleLimit,
      current: vehicleCount || 0,
      remaining: Math.max(0, vehicleLimit - (vehicleCount || 0)),
      planType
    });

  } catch (error) {
    console.error('Get vehicle limit error:', error);
    return NextResponse.json(
      { error: 'Failed to get vehicle limit' },
      { status: 500 }
    );
  }
} 