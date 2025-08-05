# API Debugging Guide

## 🔍 Issues Found:

### 1. **Email API** - 500 Error
- **Issue**: "Unexpected end of JSON input"
- **Cause**: Likely missing Resend API key or configuration
- **Fix**: Check `RESEND_API_KEY` in Vercel environment variables

### 2. **SMS API** - 500 Error  
- **Issue**: "Unexpected end of JSON input"
- **Cause**: Likely missing Vonage API keys or configuration
- **Fix**: Check `VONAGE_API_KEY` and `VONAGE_API_SECRET` in Vercel

### 3. **Vehicle API** - 500 Error
- **Issue**: "Unexpected end of JSON input"
- **Cause**: Likely missing Supabase configuration
- **Fix**: Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. **User API** - 500 Error
- **Issue**: "Unexpected end of JSON input"
- **Cause**: Likely missing Supabase configuration
- **Fix**: Check Supabase environment variables

### 5. **Subscription API** - 405 Error
- **Issue**: Method not allowed
- **Cause**: Route might not be properly configured
- **Fix**: Check the subscription route implementation

### 6. **Public API** - 401 Error
- **Issue**: "API key required"
- **Expected**: This is working correctly - it's rejecting invalid API keys

## 🛠️ Quick Fixes:

### Check Environment Variables in Vercel:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Verify these are set**:

```
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_WHITE_LABEL_PRICE_ID=price_...
STRIPE_API_PREMIUM_PRICE_ID=price_...
STRIPE_API_ENTERPRISE_PRICE_ID=price_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Resend (Email)
RESEND_API_KEY=re_...

# Vonage (SMS)
VONAGE_API_KEY=...
VONAGE_API_SECRET=...

# Site URL
NEXT_PUBLIC_SITE_URL=https://www.mot-alert.com
```

### Test Individual Services:

```bash
# Test Email Service
curl -X POST https://www.mot-alert.com/api/email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","userName":"John","type":"twoWeeks","vehicleReg":"AB12 CDE","dueDate":"2024-12-15"}'

# Test SMS Service  
curl -X POST https://www.mot-alert.com/api/sms \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"447123456789","type":"twoWeeks","vehicleReg":"AB12 CDE","dueDate":"2024-12-15"}'

# Test Database
curl -X POST https://www.mot-alert.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"John Doe","phone":"447123456789"}'
```

## 📊 Expected Results:

- **Email API**: Should return success with email sent
- **SMS API**: Should return success with SMS sent  
- **User API**: Should return created user data
- **Vehicle API**: Should return created vehicle data
- **Subscription API**: Should return checkout session URL
- **Public API**: Should return 401 for invalid keys (working correctly)

## 🔍 Next Steps:

1. **Check Vercel logs** for detailed error messages
2. **Verify all environment variables** are set correctly
3. **Test each service individually**
4. **Check service provider dashboards** (Resend, Vonage, Supabase) 