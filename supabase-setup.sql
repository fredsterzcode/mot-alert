-- MOT Alert Database Setup
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER TABLE IF EXISTS vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_activity ENABLE ROW LEVEL SECURITY;

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registration VARCHAR(20) NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  mot_due_date DATE,
  tax_due_date DATE,
  insurance_due_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table (SMS)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  message_text TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'active',
  plan_type VARCHAR(20) DEFAULT 'premium',
  amount INTEGER DEFAULT 199,
  currency VARCHAR(3) DEFAULT 'GBP',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  tier VARCHAR(20) NOT NULL DEFAULT 'BASIC',
  organization_name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create API usage table
CREATE TABLE IF NOT EXISTS api_usage (
  id SERIAL PRIMARY KEY,
  api_key VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  request_count INTEGER DEFAULT 1,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(api_key, date)
);

-- Create user sessions table for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user activity log table
CREATE TABLE IF NOT EXISTS user_activity (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_api_key ON api_usage(api_key);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own vehicles" ON vehicles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own vehicles" ON vehicles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own vehicles" ON vehicles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own vehicles" ON vehicles
  FOR DELETE USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Emails policies
CREATE POLICY "Users can view own emails" ON emails
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own emails" ON emails
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- API Keys policies
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own API keys" ON api_keys
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE USING (user_id = auth.uid());

-- API Usage policies (read-only for users)
CREATE POLICY "Users can view own API usage" ON api_usage
  FOR SELECT USING (
    api_key IN (
      SELECT api_key FROM api_keys WHERE user_id = auth.uid()
    )
  );

-- User Sessions policies
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions" ON user_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions" ON user_sessions
  FOR DELETE USING (user_id = auth.uid());

-- User Activity policies
CREATE POLICY "Users can view own activity" ON user_activity
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activity" ON user_activity
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate API keys
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'mot_' || encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Create function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_activity_type VARCHAR(50),
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_activity (user_id, activity_type, description, metadata)
  VALUES (p_user_id, p_activity_type, p_description, p_metadata);
END;
$$ LANGUAGE plpgsql;

-- Create function to get user profile data
CREATE OR REPLACE FUNCTION get_user_profile(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  phone TEXT,
  name TEXT,
  is_verified BOOLEAN,
  is_premium BOOLEAN,
  stripe_customer_id TEXT,
  reminder_preferences JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.raw_user_meta_data->>'phone' as phone,
    au.raw_user_meta_data->>'name' as name,
    COALESCE(au.raw_user_meta_data->>'is_verified', 'false')::boolean as is_verified,
    COALESCE(au.raw_user_meta_data->>'is_premium', 'false')::boolean as is_premium,
    au.raw_user_meta_data->>'stripe_customer_id' as stripe_customer_id,
    COALESCE(au.raw_user_meta_data->'reminder_preferences', '{"email": true, "sms": false}'::jsonb) as reminder_preferences
  FROM auth.users au
  WHERE au.id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
  user_uuid UUID,
  user_name TEXT DEFAULT NULL,
  user_phone TEXT DEFAULT NULL,
  user_is_premium BOOLEAN DEFAULT NULL,
  user_stripe_customer_id TEXT DEFAULT NULL,
  user_reminder_preferences JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
    'name', COALESCE(user_name, raw_user_meta_data->>'name'),
    'phone', COALESCE(user_phone, raw_user_meta_data->>'phone'),
    'is_premium', COALESCE(user_is_premium::text, raw_user_meta_data->>'is_premium'),
    'stripe_customer_id', COALESCE(user_stripe_customer_id, raw_user_meta_data->>'stripe_customer_id'),
    'reminder_preferences', COALESCE(user_reminder_preferences, raw_user_meta_data->'reminder_preferences')
  )
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE vehicles IS 'User vehicles with MOT/tax/insurance dates';
COMMENT ON TABLE messages IS 'SMS messages sent to users';
COMMENT ON TABLE emails IS 'Email messages sent to users';
COMMENT ON TABLE subscriptions IS 'User subscription plans';
COMMENT ON TABLE api_keys IS 'API keys for external integrations';
COMMENT ON TABLE api_usage IS 'API usage tracking for rate limiting';
COMMENT ON TABLE user_sessions IS 'User authentication sessions';
COMMENT ON TABLE user_activity IS 'User activity logging'; 