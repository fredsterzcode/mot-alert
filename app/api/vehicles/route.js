import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Get user's vehicles
export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Ensure user can only access their own vehicles
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch vehicles', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicles: vehicles || []
    });

  } catch (error) {
    console.error('Get vehicles error:', error);
    return NextResponse.json(
      { error: 'Failed to get vehicles', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add new vehicle
export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { userId, registration } = await request.json();

    // Validate input
    if (!registration || !registration.trim()) {
      return NextResponse.json(
        { error: 'Vehicle registration is required' },
        { status: 400 }
      );
    }

    // Ensure user can only add vehicles to their own account
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check vehicle limits based on subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    const vehicleLimit = subscription?.plan_type === 'PREMIUM' ? 3 : 1;

    // Count existing vehicles
    const { count: vehicleCount } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (vehicleCount >= vehicleLimit) {
      return NextResponse.json(
        { error: `You can only add ${vehicleLimit} vehicle${vehicleLimit > 1 ? 's' : ''} on your current plan. Upgrade to Premium for up to 3 vehicles.` },
        { status: 400 }
      );
    }

    // Check if vehicle already exists for this user
    const { data: existingVehicle } = await supabase
      .from('vehicles')
      .select('id')
      .eq('user_id', userId)
      .eq('registration', registration.toUpperCase())
      .single();

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle with this registration already exists in your account' },
        { status: 400 }
      );
    }

    // Add vehicle
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert({
        user_id: userId,
        registration: registration.toUpperCase(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to add vehicle', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle
    });

  } catch (error) {
    console.error('Add vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to add vehicle', details: error.message },
      { status: 500 }
    );
  }
} 