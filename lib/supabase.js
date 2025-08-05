import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is available
const isSupabaseAvailable = () => {
  return supabaseUrl && supabaseAnonKey;
};

/**
 * Database setup and utility functions
 */

// Initialize database tables
export async function initializeDatabase() {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - skipping initialization');
      return;
    }

    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          name VARCHAR(255),
          is_verified BOOLEAN DEFAULT FALSE,
          is_premium BOOLEAN DEFAULT FALSE,
          stripe_customer_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (usersError) {
      console.error('Error creating users table:', usersError);
    }

    // Create vehicles table
    const { error: vehiclesError } = await supabase.rpc('create_vehicles_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS vehicles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          registration VARCHAR(20) NOT NULL,
          make VARCHAR(100),
          model VARCHAR(100),
          year INTEGER,
          mot_due_date DATE,
          tax_due_date DATE,
          insurance_due_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (vehiclesError) {
      console.error('Error creating vehicles table:', vehiclesError);
    }

    // Create messages table (SMS)
    const { error: messagesError } = await supabase.rpc('create_messages_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          phone_number VARCHAR(20) NOT NULL,
          message_text TEXT NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          sent_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (messagesError) {
      console.error('Error creating messages table:', messagesError);
    }

    // Create emails table
    const { error: emailsError } = await supabase.rpc('create_emails_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS emails (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          email_address VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          sent_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (emailsError) {
      console.error('Error creating emails table:', emailsError);
    }

    // Create subscriptions table
    const { error: subscriptionsError } = await supabase.rpc('create_subscriptions_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          stripe_subscription_id VARCHAR(255) UNIQUE,
          status VARCHAR(20) DEFAULT 'active',
          plan_type VARCHAR(20) DEFAULT 'premium',
          amount INTEGER DEFAULT 199,
          currency VARCHAR(3) DEFAULT 'GBP',
          current_period_start TIMESTAMP,
          current_period_end TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (subscriptionsError) {
      console.error('Error creating subscriptions table:', subscriptionsError);
    }

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

/**
 * User management functions
 */
export async function createUser(email, name = null, phone = null) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - returning mock user');
      return {
        id: 1,
        email,
        name,
        phone,
        is_verified: false,
        is_premium: false,
        created_at: new Date(),
        updated_at: new Date()
      };
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, name, phone }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    if (!isSupabaseAvailable()) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getUserById(id) {
  try {
    if (!isSupabaseAvailable()) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function updateUser(id, updates) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - skipping update');
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Vehicle management functions
 */
export async function createVehicle(userId, vehicleData) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - returning mock vehicle');
      return {
        id: 1,
        user_id: userId,
        ...vehicleData,
        created_at: new Date(),
        updated_at: new Date()
      };
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert([{ user_id: userId, ...vehicleData }])
      .select()
      .single();

    if (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}

export async function getUserVehicles(userId) {
  try {
    if (!isSupabaseAvailable()) {
      return [];
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user vehicles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user vehicles:', error);
    return [];
  }
}

export async function getVehicleById(id) {
  try {
    if (!isSupabaseAvailable()) {
      return null;
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting vehicle:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting vehicle:', error);
    return null;
  }
}

export async function updateVehicle(id, updates) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - skipping update');
      return null;
    }

    const { data, error } = await supabase
      .from('vehicles')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
}

/**
 * Message/SMS management functions
 */
export async function createMessage(userId, vehicleId, type, phoneNumber, messageText) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - returning mock message');
      return {
        id: 1,
        user_id: userId,
        vehicle_id: vehicleId,
        type,
        phone_number: phoneNumber,
        message_text: messageText,
        status: 'pending',
        created_at: new Date()
      };
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        user_id: userId,
        vehicle_id: vehicleId,
        type,
        phone_number: phoneNumber,
        message_text: messageText
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

export async function updateMessageStatus(id, status, sentAt = null) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - skipping update');
      return null;
    }

    const { data, error } = await supabase
      .from('messages')
      .update({ 
        status, 
        sent_at: sentAt || new Date() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating message status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
}

export async function getUserMessages(userId) {
  try {
    if (!isSupabaseAvailable()) {
      return [];
    }

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        vehicles(registration)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user messages:', error);
    return [];
  }
}

/**
 * Email management functions
 */
export async function createEmail(userId, vehicleId, type, emailAddress, subject) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - returning mock email');
      return {
        id: 1,
        user_id: userId,
        vehicle_id: vehicleId,
        type,
        email_address: emailAddress,
        subject,
        status: 'pending',
        created_at: new Date()
      };
    }

    const { data, error } = await supabase
      .from('emails')
      .insert([{
        user_id: userId,
        vehicle_id: vehicleId,
        type,
        email_address: emailAddress,
        subject
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating email:', error);
    throw error;
  }
}

export async function updateEmailStatus(id, status, sentAt = null) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - skipping update');
      return null;
    }

    const { data, error } = await supabase
      .from('emails')
      .update({ 
        status, 
        sent_at: sentAt || new Date() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating email status:', error);
    throw error;
  }
}

export async function getUserEmails(userId) {
  try {
    if (!isSupabaseAvailable()) {
      return [];
    }

    const { data, error } = await supabase
      .from('emails')
      .select(`
        *,
        vehicles(registration)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user emails:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user emails:', error);
    return [];
  }
}

/**
 * Subscription management functions
 */
export async function createSubscription(userId, stripeSubscriptionId, planType = 'premium', amount = 199) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - returning mock subscription');
      return {
        id: 1,
        user_id: userId,
        stripe_subscription_id: stripeSubscriptionId,
        plan_type: planType,
        amount,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      };
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        stripe_subscription_id: stripeSubscriptionId,
        plan_type: planType,
        amount
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function getUserSubscription(userId) {
  try {
    if (!isSupabaseAvailable()) {
      return null;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

export async function updateSubscriptionStatus(stripeSubscriptionId, status) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - skipping update');
      return null;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .update({ 
        status, 
        updated_at: new Date() 
      })
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
}

/**
 * Utility functions
 */
export async function getUsersWithUpcomingMOTs(daysAhead = 30) {
  try {
    if (!isSupabaseAvailable()) {
      return [];
    }

    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        phone,
        name,
        vehicles!inner(
          id,
          registration,
          mot_due_date
        )
      `)
      .eq('is_verified', true)
      .gte('vehicles.mot_due_date', new Date().toISOString().split('T')[0])
      .lte('vehicles.mot_due_date', new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (error) {
      console.error('Error getting users with upcoming MOTs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting users with upcoming MOTs:', error);
    return [];
  }
}

export async function getUsersWithUpcomingTax(daysAhead = 30) {
  try {
    if (!isSupabaseAvailable()) {
      return [];
    }

    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        phone,
        name,
        vehicles!inner(
          id,
          registration,
          tax_due_date
        )
      `)
      .eq('is_verified', true)
      .gte('vehicles.tax_due_date', new Date().toISOString().split('T')[0])
      .lte('vehicles.tax_due_date', new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (error) {
      console.error('Error getting users with upcoming tax:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting users with upcoming tax:', error);
    return [];
  }
}

export async function getUsersWithUpcomingInsurance(daysAhead = 30) {
  try {
    if (!isSupabaseAvailable()) {
      return [];
    }

    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        phone,
        name,
        vehicles!inner(
          id,
          registration,
          insurance_due_date
        )
      `)
      .eq('is_verified', true)
      .gte('vehicles.insurance_due_date', new Date().toISOString().split('T')[0])
      .lte('vehicles.insurance_due_date', new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (error) {
      console.error('Error getting users with upcoming insurance:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting users with upcoming insurance:', error);
    return [];
  }
} 