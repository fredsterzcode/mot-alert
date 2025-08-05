#!/usr/bin/env node

console.log('🔍 Testing Environment Variables...\n');

const envVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'RESEND_API_KEY',
  'VONAGE_API_KEY',
  'VONAGE_API_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PREMIUM_PRICE_ID',
  'NEXT_PUBLIC_SITE_URL'
];

console.log('📋 Environment Variables Status:');
console.log('─'.repeat(50));

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n💡 Note: These are local environment variables.');
console.log('   For production, check Vercel environment variables.'); 