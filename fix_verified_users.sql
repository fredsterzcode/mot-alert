-- Fix verification status for existing users
-- Run this after the main fix_user_permissions.sql script

-- Update all users to have correct verification status
UPDATE public.users 
SET is_verified = true
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email_confirmed_at IS NOT NULL
);

-- Show the results
SELECT 
  u.id,
  u.email,
  u.name,
  u.is_verified,
  au.email_confirmed_at,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Verified'
    ELSE '❌ Not Verified'
  END as status
FROM public.users u
JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;
