import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('🧪 Test reminder system triggered');
    
    // Call the daily reminders endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mot-alert.com'}/api/cron/daily-reminders`);
    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Test reminder system executed',
      result
    });
    
  } catch (error) {
    console.error('Test reminder error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    );
  }
}
