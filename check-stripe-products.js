#!/usr/bin/env node

/**
 * Check Stripe Products and Prices
 * 
 * This script helps you see what products and prices exist in your Stripe account.
 * Run this to verify your setup.
 */

const Stripe = require('stripe');

async function checkStripeProducts() {
  console.log('🔍 Checking your Stripe products and prices...\n');
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Get all products
    const products = await stripe.products.list({ limit: 100 });
    
    console.log(`Found ${products.data.length} products:\n`);
    
    for (const product of products.data) {
      console.log(`📦 Product: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Description: ${product.description || 'No description'}`);
      
      // Get prices for this product
      const prices = await stripe.prices.list({
        product: product.id,
        limit: 100
      });
      
      if (prices.data.length > 0) {
        console.log(`   💰 Prices:`);
        for (const price of prices.data) {
          const amount = price.unit_amount / 100;
          const currency = price.currency.toUpperCase();
          const interval = price.recurring?.interval || 'one-time';
          console.log(`      - ${amount} ${currency}/${interval} (ID: ${price.id})`);
        }
      } else {
        console.log(`   ⚠️  No prices found for this product`);
      }
      
      console.log('');
    }
    
    // Check environment variables
    console.log('🔧 Environment Variables Check:\n');
    const priceVars = [
      'STRIPE_PREMIUM_PRICE_ID',
      'STRIPE_WHITELABEL_PRICE_ID', 
      'STRIPE_API_PREMIUM_PRICE_ID',
      'STRIPE_API_ENTERPRISE_PRICE_ID'
    ];
    
    for (const varName of priceVars) {
      const value = process.env[varName];
      if (value) {
        console.log(`✅ ${varName}: ${value}`);
      } else {
        console.log(`❌ ${varName}: Not set`);
      }
    }
    
    console.log('\n📝 Next Steps:');
    console.log('1. Copy the Price IDs (starts with "price_") from above');
    console.log('2. Add them to your environment variables');
    console.log('3. If you see "No prices found", create prices for those products');
    
  } catch (error) {
    console.error('❌ Error checking products:', error.message);
  }
}

// Run the script
if (require.main === module) {
  checkStripeProducts().catch(console.error);
}

module.exports = { checkStripeProducts }; 