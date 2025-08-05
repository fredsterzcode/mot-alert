# Environment Variables Configuration

## Required Environment Variables

Add these to your **Vercel project settings** or local `.env.local` file:

### Site Configuration
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### Database Configuration (Supabase)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Stripe Configuration
```env
# Stripe API Keys
STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_... for production
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe webhook settings

# Stripe Price IDs (Replace with your actual price IDs)
STRIPE_PREMIUM_PRICE_ID=price_1ABC123...
STRIPE_WHITELABEL_PRICE_ID=price_1DEF456...
STRIPE_API_PREMIUM_PRICE_ID=price_1GHI789...
STRIPE_API_ENTERPRISE_PRICE_ID=price_1JKL012...
```

### Email Configuration (Resend)
```env
RESEND_API_KEY=re_... # Your Resend API key
FROM_EMAIL=noreply@yourdomain.com
```

### SMS Configuration (Vonage)
```env
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_FROM_NUMBER=+44123456789
```

### API Configuration
```env
API_RATE_LIMIT=1000
API_RATE_LIMIT_WINDOW=900000
```

### Feature Flags
```env
ENABLE_SMS_REMINDERS=true
ENABLE_EMAIL_REMINDERS=true
ENABLE_API_ACCESS=true
ENABLE_WHITE_LABEL=true
```

## How to Get Your Stripe Price IDs

1. **Go to Stripe Dashboard** → https://dashboard.stripe.com
2. **Navigate to Products** → https://dashboard.stripe.com/products
3. **Create each product** as described in `STRIPE_SETUP.md`
4. **Copy the Price ID** for each product (starts with `price_`)

### Example Product Setup:

#### 1. Premium Subscription
- **Name**: "MOT Alert Premium"
- **Description**: "Premium MOT reminders with SMS, multiple vehicles, and priority support"
- **Price**: £2.99/month
- **Billing**: Recurring (monthly)
- **Price ID**: `price_1ABC123...` (copy this)

#### 2. White-Label Garage Service
- **Name**: "MOT Alert White-Label"
- **Description**: "Custom branded MOT service for garages"
- **Price**: £49.99/month
- **Billing**: Recurring (monthly)
- **Price ID**: `price_1DEF456...` (copy this)

#### 3. API Premium Tier
- **Name**: "MOT Alert API Premium"
- **Description**: "Premium API access with 10,000 requests/day"
- **Price**: £199/month
- **Billing**: Recurring (monthly)
- **Price ID**: `price_1GHI789...` (copy this)

#### 4. API Enterprise Tier
- **Name**: "MOT Alert API Enterprise"
- **Description**: "Enterprise API access with 100,000 requests/day"
- **Price**: £499/month
- **Billing**: Recurring (monthly)
- **Price ID**: `price_1JKL012...` (copy this)

## Setting Up in Vercel

1. **Go to your Vercel project**
2. **Navigate to Settings** → **Environment Variables**
3. **Add each variable** with the correct value
4. **Deploy** to apply changes

## Testing Your Configuration

### Test Stripe Connection
```bash
curl -X POST https://your-site.vercel.app/api/subscriptions/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "John Doe",
    "planType": "premium"
  }'
```

### Test Webhook
```bash
# Install Stripe CLI
stripe listen --forward-to https://your-site.vercel.app/api/webhooks/stripe
```

## Security Notes

- **Never commit** `.env.local` files to git
- **Use test keys** for development
- **Rotate keys** regularly in production
- **Monitor webhook logs** for suspicious activity
- **Use environment-specific** configurations

## Troubleshooting

### Common Issues:
1. **"Invalid API key"**: Check your Stripe keys are correct
2. **"Price not found"**: Verify price IDs exist in Stripe
3. **"Webhook signature verification failed"**: Check webhook secret
4. **"Customer not found"**: Ensure customer exists in Stripe

### Debug Steps:
1. **Check Vercel logs** for error details
2. **Verify environment variables** are set correctly
3. **Test with Stripe CLI** for local development
4. **Check webhook logs** in Stripe dashboard 