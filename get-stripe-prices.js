#!/usr/bin/env node

const Stripe = require('stripe');

// You'll need to add your Stripe secret key here temporarily
// Get it from: https://dashboard.stripe.com/apikeys
const stripe = new Stripe('sk_test_...', {
  apiVersion: '2023-10-16',
});

async function getPriceIds() {
  try {
    console.log('🔍 Fetching all products and their prices...\n');
    
    // Get all products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });
    
    console.log(`📦 Found ${products.data.length} products:\n`);
    
    for (const product of products.data) {
      console.log(`🏷️  Product: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Description: ${product.description || 'No description'}`);
      
      // Get prices for this product
      const prices = await stripe.prices.list({
        product: product.id,
        active: true
      });
      
      if (prices.data.length > 0) {
        console.log('   💰 Prices:');
        for (const price of prices.data) {
          const amount = (price.unit_amount / 100).toFixed(2);
          const currency = price.currency.toUpperCase();
          const interval = price.recurring ? `/${price.recurring.interval}` : '';
          
          console.log(`      Price ID: ${price.id}`);
          console.log(`      Amount: £${amount}${interval}`);
          console.log(`      Currency: ${currency}`);
          console.log(`      Type: ${price.type}`);
          console.log('');
        }
      } else {
        console.log('   ❌ No prices found for this product');
      }
      
      console.log('─'.repeat(50));
    }
    
    console.log('\n📋 Environment Variables to Add:');
    console.log('Add these to your Vercel environment variables:');
    console.log('');
    
    // Generate environment variable suggestions
    for (const product of products.data) {
      const prices = await stripe.prices.list({
        product: product.id,
        active: true
      });
      
      if (prices.data.length > 0) {
        const price = prices.data[0]; // Get the first price
        const planName = product.name.toLowerCase().replace(/\s+/g, '_');
        console.log(`${planName.toUpperCase()}_PRICE_ID=${price.id}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('1. Replace "sk_test_..." with your actual Stripe secret key');
    console.log('2. Get your key from: https://dashboard.stripe.com/apikeys');
  }
}

getPriceIds(); 