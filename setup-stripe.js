#!/usr/bin/env node

/**
 * Stripe Setup Validation Script
 * 
 * This script helps validate your Stripe configuration and test the setup.
 * Run this after setting up your environment variables.
 */

const Stripe = require('stripe');

// Check if environment variables are set
function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  const requiredVars = [
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PREMIUM_PRICE_ID',
    'STRIPE_WHITELABEL_PRICE_ID',
    'STRIPE_API_PREMIUM_PRICE_ID',
    'STRIPE_API_ENTERPRISE_PRICE_ID'
  ];

  const missing = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease set these in your .env.local file or Vercel environment variables.');
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
}

// Test Stripe connection
async function testStripeConnection() {
  console.log('\n🔍 Testing Stripe connection...');
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Test API connection
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe connection successful');
    console.log(`   Account: ${account.business_profile?.name || 'Test Account'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Stripe connection failed:', error.message);
    return false;
  }
}

// Validate price IDs
async function validatePriceIds() {
  console.log('\n🔍 Validating price IDs...');
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    const priceIds = [
      { name: 'Premium', id: process.env.STRIPE_PREMIUM_PRICE_ID },
      { name: 'White-Label', id: process.env.STRIPE_WHITELABEL_PRICE_ID },
      { name: 'API Premium', id: process.env.STRIPE_API_PREMIUM_PRICE_ID },
      { name: 'API Enterprise', id: process.env.STRIPE_API_ENTERPRISE_PRICE_ID }
    ];

    for (const price of priceIds) {
      try {
        const priceData = await stripe.prices.retrieve(price.id);
        console.log(`✅ ${price.name}: ${priceData.nickname || priceData.product} - ${priceData.unit_amount / 100} ${priceData.currency.toUpperCase()}`);
      } catch (error) {
        console.error(`❌ ${price.name}: Invalid price ID - ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Price validation failed:', error.message);
    return false;
  }
}

// Test webhook endpoint
async function testWebhookEndpoint() {
  console.log('\n🔍 Testing webhook endpoint...');
  
  const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/stripe`
    : 'https://your-domain.vercel.app/api/webhooks/stripe';
  
  console.log(`   Webhook URL: ${webhookUrl}`);
  console.log('   ⚠️  Make sure this endpoint is accessible and webhook secret is configured');
  
  return true;
}

// Generate test commands
function generateTestCommands() {
  console.log('\n🧪 Test Commands:');
  console.log('\n1. Test subscription creation:');
  console.log(`curl -X POST ${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'}/api/subscriptions/create \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email": "test@example.com", "name": "Test User", "planType": "premium"}\'');
  
  console.log('\n2. Test customer portal:');
  console.log(`curl -X POST ${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'}/api/subscriptions/portal \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email": "test@example.com"}\'');
  
  console.log('\n3. Test webhook (using Stripe CLI):');
  console.log('stripe listen --forward-to https://your-domain.vercel.app/api/webhooks/stripe');
}

// Main function
async function main() {
  console.log('🚀 MOT Alert - Stripe Setup Validation\n');
  
  const envCheck = checkEnvironmentVariables();
  if (!envCheck) {
    process.exit(1);
  }
  
  const stripeCheck = await testStripeConnection();
  if (!stripeCheck) {
    process.exit(1);
  }
  
  await validatePriceIds();
  testWebhookEndpoint();
  generateTestCommands();
  
  console.log('\n✅ Setup validation complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Deploy your application to Vercel');
  console.log('2. Set up webhook endpoint in Stripe dashboard');
  console.log('3. Test subscription flows with test cards');
  console.log('4. Monitor webhook logs for any issues');
  console.log('\n📚 Documentation:');
  console.log('- STRIPE_SETUP.md - Complete Stripe setup guide');
  console.log('- SUBSCRIPTION_API.md - API documentation');
  console.log('- ENVIRONMENT_VARIABLES.md - Environment variables guide');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main }; 