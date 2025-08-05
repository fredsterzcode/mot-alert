# How to Get Your Stripe Price IDs

## Step 1: Go to Stripe Dashboard
1. Visit https://dashboard.stripe.com/
2. Log in to your account

## Step 2: Find Your Products
1. Go to **Products** in the left sidebar
2. You should see your 4 products:
   - Premium Subscription
   - White-Label Garage Service  
   - API Premium Tier
   - API Enterprise Tier

## Step 3: Get Price IDs
For each product:
1. Click on the product name
2. Look for the **Pricing** section
3. You'll see a **Price ID** like `price_1ABC123...`
4. Copy this Price ID

## Step 4: Add to Environment Variables
Add these to your Vercel environment variables:
```
STRIPE_PREMIUM_PRICE_ID=price_1ABC123...
STRIPE_WHITE_LABEL_PRICE_ID=price_1DEF456...
STRIPE_API_PREMIUM_PRICE_ID=price_1GHI789...
STRIPE_API_ENTERPRISE_PRICE_ID=price_1JKL012...
```

## Step 5: Test Subscription API
Once you have the Price IDs, we can test the subscription API with the correct IDs.

## Alternative: Use Stripe CLI
If you have Stripe CLI installed:
```bash
stripe prices list
```

This will show all your Price IDs in a table format. 