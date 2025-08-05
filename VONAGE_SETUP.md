# 🚀 Vonage SMS Setup for MOT Alert

## **Step 1: Get Your Vonage Credentials**

1. **Sign up** at [Vonage.com](https://vonage.com)
2. **Go to API Settings** in your dashboard
3. **Copy your API Key and Secret**

## **Step 2: Set Environment Variables**

Create a `.env.local` file in your project root:

```env
# Vonage SMS Configuration
VONAGE_API_KEY=your_vonage_api_key_here
VONAGE_API_SECRET=your_vonage_api_secret_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Stripe Configuration (for Premium payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_here

# Resend Email Configuration (Cheaper than SendGrid)
RESEND_API_KEY=re_your_resend_key_here

# Database Configuration (Vercel Postgres)
POSTGRES_URL=postgresql://your_postgres_url_here
POSTGRES_HOST=your_postgres_host_here
POSTGRES_DATABASE=your_database_name_here
POSTGRES_USERNAME=your_username_here
POSTGRES_PASSWORD=your_password_here
```

## **Step 3: Test Your SMS Setup**

### **Test Welcome SMS:**
```bash
curl -X POST http://localhost:3000/api/sms \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "447123456789",
    "vehicleReg": "AB12 CDE"
  }'
```

### **Test MOT Reminder:**
```bash
curl -X POST http://localhost:3000/api/sms \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "447123456789",
    "type": "twoWeeks",
    "vehicleReg": "AB12 CDE",
    "dueDate": "2024-12-15"
  }'
```

## **Step 4: Available Reminder Types**

- `oneMonth` - 1 month before MOT
- `twoWeeks` - 2 weeks before MOT
- `twoDays` - 2 days before MOT
- `dayOf` - Day of MOT
- `taxReminder` - Road tax reminder
- `insuranceReminder` - Insurance reminder

## **Step 5: Cost Breakdown**

| SMS Type | Cost per SMS | Monthly Cost (100 users) |
|----------|--------------|-------------------------|
| **Vonage** | £0.02-0.03 | £2-3 |
| **Twilio** | £0.04 | £4 |
| **Savings** | **50%** | **£1-2 saved** |

## **Step 6: Email Service Setup (Resend)**

### **Why Resend instead of SendGrid/Twilio?**
- **Free tier**: 3,000 emails/month (vs SendGrid's 100/day)
- **Cost**: $20/month for 50K emails (vs SendGrid's $15/month)
- **Setup**: Much simpler API
- **Deliverability**: Excellent

### **Setup Resend:**
1. **Sign up** at [resend.com](https://resend.com)
2. **Get API key** from dashboard
3. **Add to .env**: `RESEND_API_KEY=re_your_key_here`
4. **Verify domain** (optional but recommended)

### **Test Email API:**
```bash
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "userName": "John",
    "vehicleReg": "AB12 CDE"
  }'
```

## **Step 7: Database Setup (Vercel Postgres)**

### **Setup Vercel Postgres:**
1. **Go to Vercel dashboard** → Your project → Storage
2. **Create Postgres database** (free tier available)
3. **Copy connection details** to your `.env.local`
4. **Deploy** - Vercel will automatically connect

### **Database Tables Created:**
- **users** - User accounts and verification status
- **vehicles** - Vehicle details and due dates
- **messages** - SMS history and status
- **emails** - Email history and status  
- **subscriptions** - Stripe subscription data

### **Test Database API:**
```bash
# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "John Doe",
    "phone": "447123456789"
  }'

# Add vehicle
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "registration": "AB12 CDE",
    "make": "Ford",
    "model": "Focus",
    "year": 2020,
    "motDueDate": "2024-12-15"
  }'
```

## **Step 8: Integration with MOT Alert**

The SMS, Email, and Database services are now ready to use in your MOT Alert app:

```javascript
// Send welcome SMS when user signs up
await fetch('/api/sms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '447123456789',
    vehicleReg: 'AB12 CDE'
  })
});

// Send MOT reminder
await fetch('/api/sms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '447123456789',
    type: 'twoWeeks',
    vehicleReg: 'AB12 CDE',
    dueDate: '2024-12-15'
  })
});
```

## **✅ You're Ready!**

Your MOT Alert now has:
- ✅ **Vonage SMS integration** (50% cheaper than Twilio)
- ✅ **Resend Email integration** (30x more free emails than SendGrid)
- ✅ **Vercel Postgres database** (free tier)
- ✅ **Complete user & vehicle management**
- ✅ **Professional email & SMS templates**
- ✅ **Ready for Stripe integration**

**Next: Deploy to Vercel and start your MOT Alert business!** 🚀 