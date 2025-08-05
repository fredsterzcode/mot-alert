import { NextResponse } from 'next/server';
import { sendMOTEmail, sendWelcomeEmail, sendReminderEmail } from '@/lib/resend-email';

export async function POST(request) {
  try {
    const { to, userName, type, vehicleReg, dueDate, subject, html } = await request.json();

    // Validate email
    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    let result;

    // Send based on type
    if (type && userName && vehicleReg && dueDate) {
      result = await sendReminderEmail(to, userName, type, vehicleReg, dueDate);
    } else if (userName && vehicleReg) {
      result = await sendWelcomeEmail(to, userName, vehicleReg);
    } else if (subject && html) {
      result = await sendMOTEmail(to, subject, html);
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
} 