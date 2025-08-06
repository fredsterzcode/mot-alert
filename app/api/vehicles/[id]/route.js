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

    const vehicleId = params.id;

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const { data: vehicle, error } = await supabaseClient
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .eq('user_id', user.id)
      .single();

    if (error || !vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle
    });

  } catch (error) {
    console.error('Get vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to get vehicle' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const vehicleId = params.id;
    const updates = await request.json();

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Verify vehicle belongs to user
    const { data: existingVehicle } = await supabaseClient
      .from('vehicles')
      .select('id')
      .eq('id', vehicleId)
      .eq('user_id', user.id)
      .single();

    if (!existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Update vehicle
    const { data: vehicle, error } = await supabaseClient
      .from('vehicles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', vehicleId)
      .select()
      .single();

    if (error) {
      console.error('Error updating vehicle:', error);
      return NextResponse.json(
        { error: 'Failed to update vehicle' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle
    });

  } catch (error) {
    console.error('Update vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const vehicleId = params.id;

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Verify vehicle belongs to user
    const { data: existingVehicle } = await supabaseClient
      .from('vehicles')
      .select('id')
      .eq('id', vehicleId)
      .eq('user_id', user.id)
      .single();

    if (!existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Delete vehicle
    const { error } = await supabaseClient
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (error) {
      console.error('Error deleting vehicle:', error);
      return NextResponse.json(
        { error: 'Failed to delete vehicle' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });

  } catch (error) {
    console.error('Delete vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
} 