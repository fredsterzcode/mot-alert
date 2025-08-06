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

/**
 * API Key Management System
 */

// API key prefixes for different tiers
const API_KEY_PREFIXES = {
  BASIC: 'mot_basic_',
  PREMIUM: 'mot_premium_',
  ENTERPRISE: 'mot_enterprise_'
};

// Rate limits per tier (requests per day)
const RATE_LIMITS = {
  BASIC: 100,
  PREMIUM: 10000,
  ENTERPRISE: 100000
};

/**
 * Generate a new API key
 */
export function generateApiKey(tier = 'BASIC') {
  const prefix = API_KEY_PREFIXES[tier];
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  return `${prefix}${randomPart}_${timestamp}`;
}

/**
 * Validate API key format
 */
export function validateApiKeyFormat(apiKey) {
  if (!apiKey) return false;
  
  const validPrefixes = Object.values(API_KEY_PREFIXES);
  return validPrefixes.some(prefix => apiKey.startsWith(prefix));
}

/**
 * Get API key tier from key
 */
export function getApiKeyTier(apiKey) {
  if (!apiKey) return null;
  
  for (const [tier, prefix] of Object.entries(API_KEY_PREFIXES)) {
    if (apiKey.startsWith(prefix)) {
      return tier;
    }
  }
  return null;
}

/**
 * Check rate limit for API key
 */
export async function checkRateLimit(apiKey) {
  try {
    if (!apiKey) return { allowed: false, reason: 'No API key provided', currentUsage: 0, limit: 0 };

    const tier = getApiKeyTier(apiKey);
    if (!tier) return { allowed: false, reason: 'Invalid API key format', currentUsage: 0, limit: 0 };

    const limit = RATE_LIMITS[tier];
    const today = new Date().toISOString().split('T')[0];

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return { allowed: false, reason: 'Database connection failed', currentUsage: 0, limit: 0 };
    }

    // Check usage for today
    const { data: usage, error } = await supabaseClient
      .from('api_usage')
      .select('request_count')
      .eq('api_key', apiKey)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Rate limit check error:', error);
      return { allowed: false, reason: 'Database error', currentUsage: 0, limit: 0 };
    }

    const currentUsage = usage?.request_count || 0;
    const allowed = currentUsage < limit;

    return {
      allowed,
      currentUsage,
      limit,
      remaining: Math.max(0, limit - currentUsage),
      tier
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: false, reason: 'System error', currentUsage: 0, limit: 0 };
  }
}

/**
 * Record API usage
 */
export async function recordApiUsage(apiKey, endpoint) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      console.warn('Supabase not configured - skipping usage recording');
      return;
    }
    
    // Upsert usage record
    const { error } = await supabaseClient
      .from('api_usage')
      .upsert({
        api_key: apiKey,
        date: today,
        endpoint,
        request_count: 1,
        last_used: new Date().toISOString()
      }, {
        onConflict: 'api_key,date',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error recording API usage:', error);
    }
  } catch (error) {
    console.error('Error recording API usage:', error);
  }
}

/**
 * Create API key for user/organization
 */
export async function createApiKey(userId, tier = 'BASIC', organizationName = null) {
  try {
    const apiKey = generateApiKey(tier);
    
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      throw new Error('Database connection failed');
    }
    
    const { data, error } = await supabaseClient
      .from('api_keys')
      .insert([{
        user_id: userId,
        api_key: apiKey,
        tier,
        organization_name: organizationName,
        is_active: true,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
}

/**
 * Get API keys for user
 */
export async function getUserApiKeys(userId) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user API keys:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user API keys:', error);
    return [];
  }
}

/**
 * Revoke API key
 */
export async function revokeApiKey(apiKey) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      throw new Error('Database connection failed');
    }

    const { error } = await supabaseClient
      .from('api_keys')
      .update({ is_active: false })
      .eq('api_key', apiKey);

    if (error) {
      console.error('Error revoking API key:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error revoking API key:', error);
    throw error;
  }
}

/**
 * Get API usage statistics
 */
export async function getApiUsageStats(apiKey, days = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from('api_usage')
      .select('*')
      .eq('api_key', apiKey)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) {
      console.error('Error getting API usage stats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting API usage stats:', error);
    return [];
  }
}

/**
 * Middleware to validate API requests
 */
export async function validateApiRequest(request) {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!apiKey) {
    return {
      valid: false,
      error: 'API key required',
      status: 401
    };
  }

  const rateLimit = await checkRateLimit(apiKey);
  
  if (!rateLimit.allowed) {
    return {
      valid: false,
      error: `Rate limit exceeded. ${rateLimit.currentUsage}/${rateLimit.limit} requests used today.`,
      status: 429
    };
  }

  return {
    valid: true,
    tier: rateLimit.tier,
    usage: rateLimit
  };
} 