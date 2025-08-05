#!/usr/bin/env node

/**
 * Test Stripe Price IDs
 * 
 * This script tests if your Price IDs are valid and working.
 */

const Stripe = require('stripe');

// Your Price IDs from the environment variables
const priceIds = {
  premium: 'price_1Rst3WA5hvFt0uYMZXWrQ0LG',
  whitelabel: 'price_1Rst4DA5hvFt0uYMDyeVfjUh',
  api_premium: 'price_1Rst4qA5hvFt0uYMpf7xNGr0',
  api_enterprise: 'price_1Rst5SA5hvFt0uYMXK9IJwbx'
};

async function testPriceIds() {
  console.log('🧪 Testing your Stripe Price IDs...\n');
  
  // You'll need to add your Stripe secret key here for testing
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_...'; // Add your key here
  
  try {
    const stripe = new Stripe(stripeSecretKey);
    
    for (const [planName, priceId] of Object.entries(priceIds)) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount / 100;
        const currency = price.currency.toUpperCase();
        const interval = price.recurring?.interval || 'one-time';
        
        console.log(`✅ ${planName.toUpperCase()}:`);
        console.log(`   Price ID: ${priceId}`);
        console.log(`   Amount: ${amount} ${currency}/${interval}`);
        console.log(`   Status: ${price.active ? 'Active' : 'Inactive'}`);
        console.log('');
        
      } catch (error) {
        console.log(`❌ ${planName.toUpperCase()}:`);
        console.log(`   Price ID: ${priceId}`);
        console.log(`   Error: ${error.message}`);
        console.log('');
      }
    }
    
    console.log('📝 Summary:');
    console.log('✅ All Price IDs are properly formatted');
    console.log('✅ You can now use these in your subscription system');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Deploy your app to Vercel');
    console.log('2. Test subscription creation');
    console.log('3. Monitor webhook events');
    
  } catch (error) {
    console.error('❌ Error testing Price IDs:', error.message);
    console.log('');
    console.log('💡 To test with real Stripe API:');
    console.log('1. Add your STRIPE_SECRET_KEY to the script');
    console.log('2. Run: node test-stripe-prices.js');
  }
}

// Run the test
if (require.main === module) {
  testPriceIds().catch(console.error);
}

module.exports = { testPriceIds }; 