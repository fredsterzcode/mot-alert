import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth';

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

/**
 * Partner Customer Management API Endpoints
 */

// Add customer to partner
export async function POST(request) {
  try {
    const user = await requireAuth(request);
    const {
      customerEmail,
      customerName,
      customerPhone,
      registration,
      make,
      model,
      year,
      motDueDate,
      taxDueDate,
      insuranceDueDate,
      reminderPreferences
    } = await request.json();

    // Validate required fields
    if (!customerEmail || !registration) {
      return NextResponse.json(
        { error: 'Customer email and registration are required' },
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

    // Get user's partner
    const { data: partner, error: partnerError } = await supabaseClient
      .from('partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Check if customer already exists for this partner and registration
    const { data: existingCustomer } = await supabaseClient
      .from('partner_customers')
      .select('id')
      .eq('partner_id', partner.id)
      .eq('customer_email', customerEmail)
      .eq('registration', registration)
      .single();

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email and registration already exists' },
        { status: 400 }
      );
    }

    // Add customer
    const { data: customer, error } = await supabaseClient
      .from('partner_customers')
      .insert({
        partner_id: partner.id,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        registration,
        make,
        model,
        year,
        mot_due_date: motDueDate,
        tax_due_date: taxDueDate,
        insurance_due_date: insuranceDueDate,
        reminder_preferences: reminderPreferences || { email: true, sms: false }
      })
      .select()
      .single();

    if (error) {
      console.error('Customer creation error:', error);
      return NextResponse.json(
        { error: 'Failed to add customer', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Customer added successfully',
      customer
    });

  } catch (error) {
    console.error('Customer creation error:', error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add customer', details: error.message },
      { status: 500 }
    );
  }
}

// Get partner's customers
export async function GET(request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'active';

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get user's partner
    const { data: partner, error: partnerError } = await supabaseClient
      .from('partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Build query
    let query = supabaseClient
      .from('partner_customers')
      .select('*')
      .eq('partner_id', partner.id);

    // Apply filters
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    if (search) {
      query = query.or(`customer_email.ilike.%${search}%,customer_name.ilike.%${search}%,registration.ilike.%${search}%`);
    }

    // Get total count
    const { count } = await query;

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Order by created date
    query = query.order('created_at', { ascending: false });

    const { data: customers, error } = await query;

    if (error) {
      console.error('Customer retrieval error:', error);
      return NextResponse.json(
        { error: 'Failed to get customers', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      customers,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Customer retrieval error:', error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get customers', details: error.message },
      { status: 500 }
    );
  }
}

// Bulk import customers
export async function PUT(request) {
  try {
    const user = await requireAuth(request);
    const { customers } = await request.json();

    if (!customers || !Array.isArray(customers)) {
      return NextResponse.json(
        { error: 'Customers array is required' },
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

    // Get user's partner
    const { data: partner, error: partnerError } = await supabaseClient
      .from('partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Prepare customers data
    const customersData = customers.map(customer => ({
      partner_id: partner.id,
      customer_email: customer.email,
      customer_name: customer.name,
      customer_phone: customer.phone,
      registration: customer.registration,
      make: customer.make,
      model: customer.model,
      year: customer.year,
      mot_due_date: customer.motDueDate,
      tax_due_date: customer.taxDueDate,
      insurance_due_date: customer.insuranceDueDate,
      reminder_preferences: customer.reminderPreferences || { email: true, sms: false }
    }));

    // Insert customers
    const { data: insertedCustomers, error } = await supabaseClient
      .from('partner_customers')
      .insert(customersData)
      .select();

    if (error) {
      console.error('Bulk customer import error:', error);
      return NextResponse.json(
        { error: 'Failed to import customers', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${insertedCustomers.length} customers imported successfully`,
      customers: insertedCustomers
    });

  } catch (error) {
    console.error('Bulk customer import error:', error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to import customers', details: error.message },
      { status: 500 }
    );
  }
} 