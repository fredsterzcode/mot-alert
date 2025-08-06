import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// DELETE - Delete vehicle
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

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    // First check if vehicle exists and belongs to user
    const { data: vehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('id, user_id')
      .eq('id', vehicleId)
      .single();

    if (fetchError || !vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Ensure user can only delete their own vehicles
    if (vehicle.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete vehicle
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete vehicle', details: deleteError.message },
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
      { error: 'Failed to delete vehicle', details: error.message },
      { status: 500 }
    );
  }
} 