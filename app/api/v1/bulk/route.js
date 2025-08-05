import { NextResponse } from 'next/server';
import { validateApiRequest, recordApiUsage } from '@/lib/api-keys';

/**
 * Bulk vehicle processing API (Premium/Enterprise tier)
 * POST /api/v1/bulk
 */
export async function POST(request) {
  try {
    // Validate API request
    const validation = await validateApiRequest(request);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    // Check if user has access to bulk operations
    if (validation.tier === 'BASIC') {
      return NextResponse.json(
        { error: 'Bulk operations require Premium or Enterprise tier' },
        { status: 403 }
      );
    }

    const { registrations, operation } = await request.json();

    if (!registrations || !Array.isArray(registrations)) {
      return NextResponse.json(
        { error: 'Registrations array is required' },
        { status: 400 }
      );
    }

    if (registrations.length > 100 && validation.tier === 'PREMIUM') {
      return NextResponse.json(
        { error: 'Bulk operations limited to 100 vehicles for Premium tier' },
        { status: 400 }
      );
    }

    // Record API usage
    await recordApiUsage(validation.usage.apiKey, '/api/v1/bulk');

    // Process bulk operation
    const results = [];
    for (const registration of registrations) {
      // Mock processing (in production, you'd call DVLA API)
      const result = {
        registration: registration.toUpperCase(),
        status: 'processed',
        motStatus: 'Valid',
        motExpiryDate: '2024-12-31',
        lastTestDate: '2023-12-15',
        make: 'Ford',
        model: 'Focus',
        year: '2019'
      };
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      data: {
        processed: results.length,
        results,
        operation
      },
      usage: {
        remaining: validation.usage.remaining,
        tier: validation.usage.tier
      }
    });

  } catch (error) {
    console.error('Bulk API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 