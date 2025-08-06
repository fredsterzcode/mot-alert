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

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const subscriptionId = params.id;

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Verify user owns this subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get addons for this subscription
    const { data: addons, error: addonsError } = await supabaseClient
      .from('subscription_addons')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (addonsError) {
      console.error('Error fetching addons:', addonsError);
      return NextResponse.json(
        { error: 'Failed to fetch addons' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      addons: addons || []
    });

  } catch (error) {
    console.error('Get addons error:', error);
    return NextResponse.json(
      { error: 'Failed to get addons' },
      { status: 500 }
    );
  }
} 