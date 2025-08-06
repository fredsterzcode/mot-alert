import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMOTEmail } from '@/lib/resend-email';

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
    console.log('🚀 Daily reminder cron job started');
    
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const today = new Date();
    const summary = {
      date: today.toISOString().split('T')[0],
      totalVehicles: 0,
      remindersSent: {
        oneMonth: 0,
        twoWeeks: 0,
        twoDays: 0,
        dayOf: 0
      },
      errors: [],
      usersNotified: []
    };

    // Get all vehicles with MOT due dates
    const { data: vehicles, error: vehiclesError } = await supabaseClient
      .from('vehicles')
      .select(`
        *,
        users!inner(
          id,
          email,
          name,
          is_premium,
          is_partner
        )
      `)
      .not('mot_due_date', 'is', null);

    if (vehiclesError) {
      console.error('Error fetching vehicles:', vehiclesError);
      summary.errors.push('Failed to fetch vehicles');
      return NextResponse.json(
        { error: 'Failed to fetch vehicles' },
        { status: 500 }
      );
    }

    summary.totalVehicles = vehicles.length;
    console.log(`📊 Found ${vehicles.length} vehicles with MOT dates`);

    // Process each vehicle
    for (const vehicle of vehicles) {
      try {
        const motDueDate = new Date(vehicle.mot_due_date);
        const daysUntilDue = Math.ceil((motDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let reminderType = null;
        
        // Determine if reminder should be sent
        if (daysUntilDue === 30) {
          reminderType = 'oneMonth';
        } else if (daysUntilDue === 14) {
          reminderType = 'twoWeeks';
        } else if (daysUntilDue === 2) {
          reminderType = 'twoDays';
        } else if (daysUntilDue === 0) {
          reminderType = 'dayOf';
        }

        if (reminderType) {
          // Send reminder email
          const emailResult = await sendReminderEmail(
            vehicle.users.email,
            vehicle.users.name,
            reminderType,
            vehicle.registration,
            vehicle.mot_due_date
          );

          if (emailResult.success) {
            summary.remindersSent[reminderType]++;
            summary.usersNotified.push({
              email: vehicle.users.email,
              vehicle: vehicle.registration,
              type: reminderType,
              daysUntilDue
            });
            
            console.log(`✅ Sent ${reminderType} reminder to ${vehicle.users.email} for ${vehicle.registration}`);
          } else {
            summary.errors.push(`Failed to send ${reminderType} reminder to ${vehicle.users.email}`);
            console.error(`❌ Failed to send ${reminderType} reminder to ${vehicle.users.email}`);
          }
        }
      } catch (error) {
        console.error('Error processing vehicle:', error);
        summary.errors.push(`Error processing vehicle ${vehicle.registration}: ${error.message}`);
      }
    }

    // Send summary email to info@facsystems.co.uk
    await sendSummaryEmail(summary);

    console.log('✅ Daily reminder cron job completed');
    
    return NextResponse.json({
      success: true,
      message: 'Daily reminders processed',
      summary
    });

  } catch (error) {
    console.error('Daily reminder cron job error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}

async function sendReminderEmail(to, userName, type, vehicleReg, dueDate) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mot-alert.com'}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        userName,
        type,
        vehicleReg,
        dueDate
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return { success: false, error: error.message };
  }
}

async function sendSummaryEmail(summary) {
  try {
    const subject = `MOT Alert Daily Summary - ${summary.date}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">MOT Alert Daily Summary 📊</h2>
        <p><strong>Date:</strong> ${summary.date}</p>
        
        <h3 style="color: #059669;">📈 Summary</h3>
        <ul>
          <li><strong>Total vehicles processed:</strong> ${summary.totalVehicles}</li>
          <li><strong>1 month reminders sent:</strong> ${summary.remindersSent.oneMonth}</li>
          <li><strong>2 weeks reminders sent:</strong> ${summary.remindersSent.twoWeeks}</li>
          <li><strong>2 days reminders sent:</strong> ${summary.remindersSent.twoDays}</li>
          <li><strong>Day of reminders sent:</strong> ${summary.remindersSent.dayOf}</li>
        </ul>
        
        <h3 style="color: #dc2626;">❌ Errors (${summary.errors.length})</h3>
        ${summary.errors.length > 0 ? 
          `<ul>${summary.errors.map(error => `<li style="color: #dc2626;">${error}</li>`).join('')}</ul>` : 
          '<p style="color: #059669;">✅ No errors today!</p>'
        }
        
        <h3 style="color: #2563eb;">👥 Users Notified (${summary.usersNotified.length})</h3>
        ${summary.usersNotified.length > 0 ? 
          `<ul>${summary.usersNotified.map(user => 
            `<li><strong>${user.email}</strong> - ${user.vehicle} (${user.type}, ${user.daysUntilDue} days)</li>`
          ).join('')}</ul>` : 
          '<p>No reminders sent today</p>'
        }
        
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          This is an automated summary from MOT Alert's daily reminder system.
        </p>
      </div>
    `;

    await sendMOTEmail('info@facsystems.co.uk', subject, html);
    console.log('📧 Summary email sent to info@facsystems.co.uk');
    
  } catch (error) {
    console.error('Error sending summary email:', error);
  }
}
