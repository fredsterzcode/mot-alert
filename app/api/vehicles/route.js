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

    const { data: vehicles, error } = await supabaseClient
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vehicles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch vehicles' },
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
      { error: 'Failed to get vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { 
      registration, 
      make, 
      model, 
      year, 
      motDueDate, 
      taxDueDate, 
      insuranceDueDate 
    } = await request.json();

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration is required' },
        { status: 400 }
      );
    }

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if vehicle already exists for this user
    const { data: existingVehicle } = await supabaseClient
      .from('vehicles')
      .select('id')
      .eq('user_id', user.id)
      .eq('registration', registration.toUpperCase())
      .single();

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle with this registration already exists' },
        { status: 400 }
      );
    }

    // Create vehicle
    const { data: vehicle, error } = await supabaseClient
      .from('vehicles')
      .insert({
        user_id: user.id,
        registration: registration.toUpperCase(),
        make,
        model,
        year,
        mot_due_date: motDueDate,
        tax_due_date: taxDueDate,
        insurance_due_date: insuranceDueDate
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating vehicle:', error);
      return NextResponse.json(
        { error: 'Failed to create vehicle' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vehicle added successfully',
      vehicle
    });

  } catch (error) {
    console.error('Create vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
} 