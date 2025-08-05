# Stripe Setup Guide

## Step 1: Complete Stripe Account Setup

1. **Go to Stripe Dashboard** → https://dashboard.stripe.com
2. **Complete account verification**:
   - Business details
   - Identity verification
   - Bank account for payouts
3. **Enable payments** for your region

## Step 2: Create Products and Pricing

### 1. Premium Subscription
**Go to**: Products → Add Product
- **Name**: "MOT Alert Premium"
- **Description**: "Premium MOT reminders with SMS, multiple vehicles, and priority support"
- **Price**: £2.99/month
- **Billing**: Recurring (monthly)
- **Save and copy Price ID**

### 2. White-Label Garage Service
**Go to**: Products → Add Product
- **Name**: "MOT Alert White-Label"
- **Description**: "Custom branded MOT service for garages"
- **Price**: £49.99/month
- **Billing**: Recurring (monthly)
- **Save and copy Price ID**

### 3. API Premium Tier
**Go to**: Products → Add Product
- **Name**: "MOT Alert API Premium"
- **Description**: "Premium API access with 10,000 requests/day"
- **Price**: £199/month
- **Billing**: Recurring (monthly)
- **Save and copy Price ID**

### 4. API Enterprise Tier
**Go to**: Products → Add Product
- **Name**: "MOT Alert API Enterprise"
- **Description**: "Enterprise API access with 100,000 requests/day"
- **Price**: £499/month
- **Billing**: Recurring (monthly)
- **Save and copy Price ID**

## Step 3: Set Up Webhooks

### 1. Create Webhook Endpoint
**Go to**: Developers → Webhooks → Add endpoint
- **Endpoint URL**: `https://your-site.vercel.app/api/webhooks/stripe`
- **Events to send**:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### 2. Get Webhook Secret
- **Copy the webhook signing secret** (starts with `whsec_`)
- **Add to Vercel environment variables**

## Step 4: Add Environment Variables

Add these to your **Vercel project settings**:

```env
# Stripe API Keys
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PREMIUM_PRICE_ID=price_1ABC123...
STRIPE_WHITELABEL_PRICE_ID=price_1DEF456...
STRIPE_API_PREMIUM_PRICE_ID=price_1GHI789...
STRIPE_API_ENTERPRISE_PRICE_ID=price_1JKL012...
```

## Step 5: Test Your Setup

### Test Subscription Creation
```bash
curl -X POST https://your-site.vercel.app/api/subscriptions/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "John Doe",
    "planType": "premium"
  }'
```

### Test Subscription Cancellation
```bash
curl -X POST https://your-site.vercel.app/api/subscriptions/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "sub_1234567890"
  }'
```

## Step 6: Monitor Payments

### Stripe Dashboard
- **Payments**: View all transactions
- **Customers**: Manage customer data
- **Subscriptions**: Track active subscriptions
- **Invoices**: View billing history

### Webhook Logs
- **Go to**: Developers → Webhooks
- **Click on your endpoint**
- **View webhook logs** for debugging

## Pricing Strategy

### Free Tier
- **Cost**: £0/month
- **Features**: Basic MOT reminders (email only)
- **Limit**: 1 vehicle

### Premium Tier
- **Cost**: £2.99/month
- **Features**: SMS reminders, multiple vehicles, priority support
- **Limit**: 5 vehicles

### White-Label Service
- **Cost**: £49.99/month
- **Features**: Custom branding, bulk SMS/Email, API access
- **Limit**: Unlimited vehicles

### API Premium
- **Cost**: £199/month
- **Features**: 10,000 API requests/day, bulk operations
- **Limit**: 100 vehicles per bulk operation

### API Enterprise
- **Cost**: £499/month
- **Features**: 100,000 API requests/day, unlimited bulk operations
- **Limit**: Unlimited

## Revenue Projections

### Monthly Revenue Targets
- **100 Premium subscribers**: £299/month
- **10 White-label customers**: £499.90/month
- **5 API Premium customers**: £995/month
- **2 API Enterprise customers**: £998/month
- **Total**: £2,791.90/month

### Annual Revenue Targets
- **Year 1**: £33,502.80
- **Year 2**: £167,514
- **Year 3**: £335,028

## Troubleshooting

### Common Issues
1. **Webhook failures**: Check endpoint URL and secret
2. **Payment failures**: Verify card details and limits
3. **Subscription issues**: Check price IDs and customer data
4. **API errors**: Verify Stripe keys and permissions

### Support Resources
- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: Available in dashboard
- **Webhook Testing**: Use Stripe CLI for local testing

## Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Always verify webhook signatures**
3. **Use test keys** for development
4. **Monitor webhook logs** for suspicious activity
5. **Implement proper error handling**

## Next Steps

1. **Test all subscription flows**
2. **Set up customer portal** for self-service
3. **Implement usage tracking** for API tiers
4. **Add payment analytics** and reporting
5. **Create automated billing** reminders 