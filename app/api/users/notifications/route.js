import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get user notification preferences
export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's notification preferences
    const { data: userData, error } = await supabase
      .from('users')
      .select('reminder_preferences')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching notification preferences:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notification preferences' },
        { status: 500 }
      );
    }

    // Return default preferences if none set
    const preferences = userData.reminder_preferences || {
      emailNotifications: true,
      smsNotifications: false,
      motReminders: true,
      taxReminders: true,
      insuranceReminders: true,
      reminderFrequency: '7,3,1'
    };

    return NextResponse.json({
      success: true,
      preferences
    });

  } catch (error) {
    console.error('Get notification preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to get notification preferences' },
      { status: 500 }
    );
  }
}

// Update user notification preferences
export async function PUT(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const {
      emailNotifications,
      smsNotifications,
      motReminders,
      taxReminders,
      insuranceReminders,
      reminderFrequency
    } = await request.json();

    // Validate required fields
    if (typeof emailNotifications !== 'boolean' || 
        typeof smsNotifications !== 'boolean' ||
        typeof motReminders !== 'boolean' ||
        typeof taxReminders !== 'boolean' ||
        typeof insuranceReminders !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid notification preferences' },
        { status: 400 }
      );
    }

    // Validate reminder frequency
    if (!reminderFrequency || typeof reminderFrequency !== 'string') {
      return NextResponse.json(
        { error: 'Invalid reminder frequency' },
        { status: 400 }
      );
    }

    // Check if user can enable SMS notifications
    const { data: userData } = await supabase
      .from('users')
      .select('is_premium, is_partner')
      .eq('id', user.id)
      .single();

    if (smsNotifications && !userData.is_premium && !userData.is_partner) {
      return NextResponse.json(
        { error: 'SMS notifications require Premium or Partner account' },
        { status: 400 }
      );
    }

    // Update notification preferences
    const preferences = {
      emailNotifications,
      smsNotifications,
      motReminders,
      taxReminders,
      insuranceReminders,
      reminderFrequency
    };

    const { error } = await supabase
      .from('users')
      .update({
        reminder_preferences: preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating notification preferences:', error);
      return NextResponse.json(
        { error: 'Failed to update notification preferences' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
      preferences
    });

  } catch (error) {
    console.error('Update notification preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
} 