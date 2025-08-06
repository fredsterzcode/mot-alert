-- Fix user permissions by updating the handle_new_user function
-- This ensures free users get free features, premium users get premium features, etc.

-- First, add the missing is_partner column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_partner BOOLEAN DEFAULT false;

-- Drop the existing trigger first (since it depends on the function)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the updated function that properly sets user type flags
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    phone,
    is_verified,
    is_premium,
    is_partner,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email_confirmed_at IS NOT NULL,
    CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'premium' THEN true
      WHEN NEW.raw_user_meta_data->>'user_type' = 'partner' THEN true
      ELSE false
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'partner' THEN true
      ELSE false
    END,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing users to have correct permissions
-- This will fix any users that were created before this fix

-- Set premium users
UPDATE public.users 
SET is_premium = true, is_partner = false
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE raw_user_meta_data->>'user_type' = 'premium'
);

-- Set partner users  
UPDATE public.users 
SET is_premium = true, is_partner = true
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE raw_user_meta_data->>'user_type' = 'partner'
);

-- Set free users (default)
UPDATE public.users 
SET is_premium = false, is_partner = false
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE raw_user_meta_data->>'user_type' = 'free' 
  OR raw_user_meta_data->>'user_type' IS NULL
);

-- Verify the changes
SELECT 
  u.id,
  u.email,
  u.name,
  u.is_premium,
  u.is_partner,
  au.raw_user_meta_data->>'user_type' as auth_user_type
FROM public.users u
JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC
LIMIT 10;
