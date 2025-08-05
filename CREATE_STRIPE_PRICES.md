# Creating Stripe Prices for Your Products

## The Issue
You have **Product IDs** but need **Price IDs** for subscriptions to work. Here's how to create prices for your existing products.

## Step-by-Step Guide

### 1. Go to Your Stripe Dashboard
- Visit: https://dashboard.stripe.com
- Navigate to **Products** → https://dashboard.stripe.com/products

### 2. For Each Product, Create a Price

#### Premium Subscription
1. **Click on your Premium product**
2. **Click "Add pricing"** or "Create price"
3. **Set up the price**:
   - **Amount**: 299 (this is £2.99 in pence)
   - **Currency**: GBP
   - **Billing**: Recurring
   - **Billing period**: Monthly
4. **Click "Save"**
5. **Copy the Price ID** (starts with `price_`)

#### White-Label Service
1. **Click on your White-Label product**
2. **Click "Add pricing"**
3. **Set up the price**:
   - **Amount**: 4999 (this is £49.99 in pence)
   - **Currency**: GBP
   - **Billing**: Recurring
   - **Billing period**: Monthly
4. **Click "Save"**
5. **Copy the Price ID**

#### API Premium Tier
1. **Click on your API Premium product**
2. **Click "Add pricing"**
3. **Set up the price**:
   - **Amount**: 19900 (this is £199.00 in pence)
   - **Currency**: GBP
   - **Billing**: Recurring
   - **Billing period**: Monthly
4. **Click "Save"**
5. **Copy the Price ID**

#### API Enterprise Tier
1. **Click on your API Enterprise product**
2. **Click "Add pricing"**
3. **Set up the price**:
   - **Amount**: 49900 (this is £499.00 in pence)
   - **Currency**: GBP
   - **Billing**: Recurring
   - **Billing period**: Monthly
4. **Click "Save"**
5. **Copy the Price ID**

## Quick Check Script

Run this script to see what you have:

```bash
node check-stripe-products.js
```

This will show you:
- All your products
- Their associated prices
- The Price IDs you need to copy

## Environment Variables

Once you have the Price IDs, add them to your environment variables:

```env
STRIPE_PREMIUM_PRICE_ID=price_1ABC123...
STRIPE_WHITELABEL_PRICE_ID=price_1DEF456...
STRIPE_API_PREMIUM_PRICE_ID=price_1GHI789...
STRIPE_API_ENTERPRISE_PRICE_ID=price_1JKL012...
```

## Common Issues

### "I don't see Add pricing button"
- Make sure you're in the **Products** section, not **Prices**
- Click on the specific product first
- Look for "Pricing" or "Add pricing" in the product details

### "Amount field is confusing"
- Stripe uses **pence** (smallest currency unit)
- £2.99 = 299 pence
- £49.99 = 4999 pence
- £199.00 = 19900 pence
- £499.00 = 49900 pence

### "I can't find my products"
- Make sure you're in the correct Stripe account
- Check if you're in test mode vs live mode
- Products are account-specific

## Verification

After creating prices, run the check script again to verify:

```bash
node check-stripe-products.js
```

You should see all your products with their associated prices and Price IDs.

## Next Steps

1. **Create prices** for all your products
2. **Copy the Price IDs** from the check script
3. **Add them to your environment variables**
4. **Test the subscription system**

## Need Help?

If you're still having trouble:
1. **Screenshot** your Stripe products page
2. **Run the check script** and share the output
3. **Check** if you're in the right Stripe account (test vs live) 