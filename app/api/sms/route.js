import { NextResponse } from 'next/server';
import { sendMOTReminder, sendWelcomeSMS, sendReminder } from '@/lib/vonage-sms';

export async function POST(request) {
  try {
    const { phoneNumber, message, type, vehicleReg, dueDate } = await request.json();

    // Validate phone number (UK format)
    if (!phoneNumber || !phoneNumber.startsWith('44')) {
      return NextResponse.json(
        { error: 'Invalid phone number. Must be UK format (44xxxxxxxxxx)' },
        { status: 400 }
      );
    }

    let result;

    // Send based on type
    if (type && vehicleReg && dueDate) {
      result = await sendReminder(phoneNumber, type, vehicleReg, dueDate);
    } else if (message) {
      result = await sendMOTReminder(phoneNumber, message);
    } else if (vehicleReg) {
      result = await sendWelcomeSMS(phoneNumber, vehicleReg);
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
      data: result
    });

  } catch (error) {
    console.error('SMS API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS', details: error.message },
      { status: 500 }
    );
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    message: 'MOT Alert SMS API is running',
    endpoints: {
      POST: '/api/sms - Send SMS reminder',
      examples: {
        welcome: {
          phoneNumber: '447123456789',
          vehicleReg: 'AB12 CDE'
        },
        reminder: {
          phoneNumber: '447123456789',
          type: 'twoWeeks',
          vehicleReg: 'AB12 CDE',
          dueDate: '2024-12-15'
        }
      }
    }
  });
} 