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

// GET - Get user's subscription
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Ensure user can only access their own subscription
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { data: subscription, error } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to fetch subscription', details: error.message },
        { status: 500 }
      );
    }

    // If no subscription found, return default free plan
    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: {
          id: null,
          plan_type: 'FREE',
          status: 'active',
          current_period_end: null
        }
      });
    }

    return NextResponse.json({
      success: true,
      subscription
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription', details: error.message },
      { status: 500 }
    );
  }
} 