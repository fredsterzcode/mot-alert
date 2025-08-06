import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Partner Management API Endpoints
 */

// Create new partner
export async function POST(request) {
  try {
    const user = await requireAuth(request);
    const {
      name,
      subdomain,
      companyName,
      contactEmail,
      phone,
      address,
      logoUrl,
      primaryColor,
      secondaryColor,
      companyDescription,
      websiteUrl,
      planType = 'BASIC',
      commissionRate = 0.00
    } = await request.json();

    // Validate required fields
    if (!name || !subdomain || !companyName || !contactEmail) {
      return NextResponse.json(
        { error: 'Name, subdomain, company name, and contact email are required' },
        { status: 400 }
      );
    }

    // Check if subdomain is available
    const { data: existingPartner } = await supabase
      .from('partners')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (existingPartner) {
      return NextResponse.json(
        { error: 'Subdomain already taken' },
        { status: 400 }
      );
    }

    // Create partner
    const { data: partner, error } = await supabase
      .from('partners')
      .insert({
        user_id: user.id,
        name,
        subdomain,
        company_name: companyName,
        contact_email: contactEmail,
        phone,
        address,
        logo_url: logoUrl,
        primary_color: primaryColor || '#3B82F6',
        secondary_color: secondaryColor || '#1F2937',
        company_description: companyDescription,
        website_url: websiteUrl,
        plan_type: planType,
        commission_rate: commissionRate
      })
      .select()
      .single();

    if (error) {
      console.error('Partner creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create partner', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Partner created successfully',
      partner
    });

  } catch (error) {
    console.error('Partner creation error:', error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create partner', details: error.message },
      { status: 500 }
    );
  }
}

// Get user's partner data
export async function GET(request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';

    const { data: partner, error } = await supabase
      .from('partners')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          partner: null,
          isPartner: false
        });
      }
      throw error;
    }

    let response = {
      success: true,
      partner,
      isPartner: true
    };

    if (includeStats) {
      // Get partner statistics
      const { data: customerCount } = await supabase
        .from('partner_customers')
        .select('id', { count: 'exact' })
        .eq('partner_id', partner.id)
        .eq('is_active', true);

      const { data: vehicleCount } = await supabase
        .from('partner_customers')
        .select('id', { count: 'exact' })
        .eq('partner_id', partner.id)
        .eq('is_active', true);

      response.stats = {
        customerCount: customerCount?.length || 0,
        vehicleCount: vehicleCount?.length || 0
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Partner retrieval error:', error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get partner data', details: error.message },
      { status: 500 }
    );
  }
}

// Update partner
export async function PUT(request) {
  try {
    const user = await requireAuth(request);
    const {
      name,
      companyName,
      contactEmail,
      phone,
      address,
      logoUrl,
      primaryColor,
      secondaryColor,
      companyDescription,
      websiteUrl,
      planType,
      commissionRate
    } = await request.json();

    // Get user's partner
    const { data: partner, error: partnerError } = await supabase
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

    // Update partner
    const { data: updatedPartner, error } = await supabase
      .from('partners')
      .update({
        name,
        company_name: companyName,
        contact_email: contactEmail,
        phone,
        address,
        logo_url: logoUrl,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        company_description: companyDescription,
        website_url: websiteUrl,
        plan_type: planType,
        commission_rate: commissionRate
      })
      .eq('id', partner.id)
      .select()
      .single();

    if (error) {
      console.error('Partner update error:', error);
      return NextResponse.json(
        { error: 'Failed to update partner', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Partner updated successfully',
      partner: updatedPartner
    });

  } catch (error) {
    console.error('Partner update error:', error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update partner', details: error.message },
      { status: 500 }
    );
  }
} 