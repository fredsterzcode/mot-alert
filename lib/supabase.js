import { createClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase client
let supabase = null;

const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not configured');
      return null;
    }
    
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};

// Check if Supabase is available
const isSupabaseAvailable = () => {
  const client = getSupabaseClient();
  return client !== null;
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

    console.log('Database tables already created via SQL script');
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
        id: 'mock-user-id',
        email,
        name,
        phone,
        is_verified: false,
        is_premium: false,
        created_at: new Date(),
        updated_at: new Date()
      };
    }

    // For Supabase Auth, users are created through the auth system
    // This function is mainly for updating user metadata
    const { data: { user }, error } = await getSupabaseClient().auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      throw error;
    }

    // Update user metadata
    const { error: updateError } = await getSupabaseClient().auth.updateUser({
      data: {
        name,
        phone,
        is_verified: false,
        is_premium: false
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      throw updateError;
    }

    return user;
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

    // Get user from auth.users
    const { data: { users }, error } = await getSupabaseClient().auth.admin.listUsers();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    const user = users.find(u => u.email === email);
    return user || null;
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

    const { data: { user }, error } = await getSupabaseClient().auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return user;
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

    const { data: { user }, error } = await getSupabaseClient().auth.updateUser({
      data: updates
    });

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return user;
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
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

    const { data, error } = await getSupabaseClient()
      .from('vehicles')
      .select(`
        user_id,
        registration,
        mot_due_date,
        users!inner(
          id,
          email,
          raw_user_meta_data
        )
      `)
      .gte('mot_due_date', new Date().toISOString().split('T')[0])
      .lte('mot_due_date', new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

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

    const { data, error } = await getSupabaseClient()
      .from('vehicles')
      .select(`
        user_id,
        registration,
        tax_due_date,
        users!inner(
          id,
          email,
          raw_user_meta_data
        )
      `)
      .gte('tax_due_date', new Date().toISOString().split('T')[0])
      .lte('tax_due_date', new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

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

    const { data, error } = await getSupabaseClient()
      .from('vehicles')
      .select(`
        user_id,
        registration,
        insurance_due_date,
        users!inner(
          id,
          email,
          raw_user_meta_data
        )
      `)
      .gte('insurance_due_date', new Date().toISOString().split('T')[0])
      .lte('insurance_due_date', new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

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