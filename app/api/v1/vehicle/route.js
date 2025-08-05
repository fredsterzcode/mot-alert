import { NextResponse } from 'next/server';
import { validateApiRequest, recordApiUsage } from '@/lib/api-keys';

/**
 * Public API endpoint for vehicle MOT checks
 * GET /api/v1/vehicle?registration=ABC123
 */
export async function GET(request) {
  try {
    // Validate API request
    const validation = await validateApiRequest(request);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const registration = searchParams.get('registration');

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration number is required' },
        { status: 400 }
      );
    }

    // Record API usage
    await recordApiUsage(validation.usage.apiKey, '/api/v1/vehicle');

    // Mock MOT data (in production, you'd call DVLA API)
    const motData = {
      registration: registration.toUpperCase(),
      motStatus: 'Valid',
      motExpiryDate: '2024-12-31',
      lastTestDate: '2023-12-15',
      mileage: '45,000',
      make: 'Ford',
      model: 'Focus',
      year: '2019',
      color: 'Blue',
      fuelType: 'Petrol',
      engineSize: '1.0L',
      advisories: [
        'Nearside front tyre worn close to legal limit',
        'Offside rear brake disc worn'
      ],
      failures: [],
      testResult: 'PASS'
    };

    return NextResponse.json({
      success: true,
      data: motData,
      usage: {
        remaining: validation.usage.remaining,
        tier: validation.usage.tier
      }
    });

  } catch (error) {
    console.error('Vehicle API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 