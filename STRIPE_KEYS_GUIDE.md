# Stripe Keys & IDs Setup Guide

## 🔑 Required Stripe Environment Variables

You need these environment variables in your Vercel project:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_WHITE_LABEL_PRICE_ID=price_...
STRIPE_API_PREMIUM_PRICE_ID=price_...
STRIPE_API_ENTERPRISE_PRICE_ID=price_...
```

## 📋 Step-by-Step Setup

### Step 1: Get Your Stripe API Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/apikeys
2. **Copy your keys**:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 2: Get Your Price IDs

1. **Go to Products**: https://dashboard.stripe.com/products
2. **Click on each product** you created
3. **Look for "Pricing" section**
4. **Copy the Price ID** (starts with `price_`)

### Step 3: Create Webhook Endpoint

1. **Go to Webhooks**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"**
3. **Enter your webhook URL**: `https://your-app.vercel.app/api/webhooks/stripe`
4. **Select these events**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Copy the webhook secret** (starts with `whsec_`)

### Step 4: Add to Vercel Environment Variables

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add each variable**:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id
STRIPE_WHITE_LABEL_PRICE_ID=price_your_white_label_price_id
STRIPE_API_PREMIUM_PRICE_ID=price_your_api_premium_price_id
STRIPE_API_ENTERPRISE_PRICE_ID=price_your_api_enterprise_price_id
```

## 🧪 Test Your Setup

Run this script to verify your configuration:

```bash
node get-stripe-prices.js
```

## ⚠️ Important Notes

- **Never commit secret keys** to your code
- **Use test keys** for development
- **Switch to live keys** when going to production
- **Keep your webhook secret secure**

## 🔍 Troubleshooting

### If you get "Invalid API Key" errors:
- Check your secret key is correct
- Make sure you're using the right environment (test vs live)

### If webhooks aren't working:
- Verify the webhook URL is correct
- Check the webhook secret matches
- Ensure the events are selected

### If subscriptions fail:
- Verify Price IDs are correct
- Check the Price IDs are for recurring subscriptions
- Ensure the Price IDs are active 