# Live API Testing Guide

## 🚀 How to Test Your Live APIs

### Step 1: Get Your Vercel URL

1. **Go to your Vercel dashboard** → https://vercel.com/dashboard
2. **Find your MOT Alert project**
3. **Copy the deployment URL** (e.g., `https://mot-alert.vercel.app`)

### Step 2: Test Your APIs

Replace `YOUR_VERCEL_URL` with your actual Vercel URL in all commands below.

## 📧 Email API Tests

### Test Email Reminder
```bash
curl -X POST https://YOUR_VERCEL_URL/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "userName": "John",
    "type": "twoWeeks",
    "vehicleReg": "AB12 CDE",
    "dueDate": "2024-12-15"
  }'
```

### Test Welcome Email
```bash
curl -X POST https://YOUR_VERCEL_URL/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "userName": "John",
    "vehicleReg": "AB12 CDE"
  }'
```

## 📱 SMS API Tests

### Test SMS Reminder
```bash
curl -X POST https://YOUR_VERCEL_URL/api/sms \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "447123456789",
    "type": "twoWeeks",
    "vehicleReg": "AB12 CDE",
    "dueDate": "2024-12-15"
  }'
```

### Test SMS Status
```bash
curl https://YOUR_VERCEL_URL/api/sms
```

## 🚗 Vehicle API Tests

### Add Vehicle
```bash
curl -X POST https://YOUR_VERCEL_URL/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "registration": "AB12 CDE",
    "make": "Ford",
    "model": "Focus",
    "year": "2019",
    "motDueDate": "2024-12-15"
  }'
```

### Get User Vehicles
```bash
curl "https://YOUR_VERCEL_URL/api/vehicles?userId=test-user-123"
```

## 👤 User API Tests

### Create User
```bash
curl -X POST https://YOUR_VERCEL_URL/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "John Doe",
    "phone": "447123456789"
  }'
```

### Get User
```bash
curl "https://YOUR_VERCEL_URL/api/users?email=test@example.com"
```

## 💳 Subscription API Tests

### Create Subscription
```bash
curl -X POST https://YOUR_VERCEL_URL/api/subscriptions/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "John Doe",
    "planType": "premium"
  }'
```

### Customer Portal
```bash
curl -X POST https://YOUR_VERCEL_URL/api/subscriptions/portal \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## 🔍 Public API Tests

### Vehicle MOT Check
```bash
curl "https://YOUR_VERCEL_URL/api/v1/vehicle?registration=AB12CDE&api_key=your_api_key"
```

## 🧪 Automated Testing

### Run the Test Script
```bash
# Edit the script to add your Vercel URL
node test-live-apis.js
```

## 📊 Expected Responses

### Success Response
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Invalid email address",
  "details": "Email format is invalid"
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **404 Not Found**
   - Check your Vercel URL is correct
   - Ensure the API route exists

2. **500 Internal Server Error**
   - Check Vercel logs for details
   - Verify environment variables are set

3. **Environment Variable Errors**
   - Ensure all required vars are in Vercel
   - Check variable names match exactly

4. **Database Connection Errors**
   - Verify Supabase credentials
   - Check database is accessible

### Check Vercel Logs:

1. **Go to Vercel Dashboard**
2. **Click on your project**
3. **Go to Functions tab**
4. **Check recent deployments**
5. **View function logs**

## 🎯 Testing Checklist

- [ ] Email API sends reminders
- [ ] SMS API sends reminders  
- [ ] Vehicle API creates/retrieves vehicles
- [ ] User API creates/retrieves users
- [ ] Subscription API creates subscriptions
- [ ] Public API returns MOT data
- [ ] All error handling works
- [ ] Environment variables are loaded
- [ ] Database connections work
- [ ] Stripe integration functions

## 📈 Monitoring

### Set up monitoring for:
- API response times
- Error rates
- Database performance
- Stripe webhook events
- Email/SMS delivery rates

### Tools to use:
- Vercel Analytics
- Stripe Dashboard
- Supabase Dashboard
- Email/SMS provider dashboards 