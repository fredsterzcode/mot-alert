# Supabase Setup Guide for MOT Alert

## 🚀 Quick Setup

### 1. Access Your Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your MOT Alert project

### 2. Run the Database Setup
1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click **Run** to execute the script

### 3. Verify Tables Created
After running the script, you should see these tables in your **Table Editor**:

- ✅ `users` - User accounts and profiles
- ✅ `vehicles` - User vehicles with MOT/tax/insurance dates
- ✅ `messages` - SMS messages sent to users
- ✅ `emails` - Email messages sent to users
- ✅ `subscriptions` - User subscription plans
- ✅ `api_keys` - API keys for external integrations
- ✅ `api_usage` - API usage tracking for rate limiting
- ✅ `user_sessions` - User authentication sessions
- ✅ `user_activity` - User activity logging

## 🔧 What the Setup Includes

### Database Tables
- **Complete user management** with authentication support
- **Vehicle tracking** with MOT, tax, and insurance dates
- **Message/Email logging** for SMS and email communications
- **Subscription management** for Stripe integration
- **API key management** for external integrations
- **Usage tracking** for rate limiting
- **Session management** for user authentication
- **Activity logging** for user actions

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **User-specific policies** ensuring users can only access their own data
- **Automatic timestamps** for created_at and updated_at fields
- **Indexes** for optimal query performance

### Helper Functions
- **API key generation** function
- **User activity logging** function
- **Automatic timestamp updates** triggers

## 🧪 Test Data
The setup script includes sample test data:
- Test user: `test@example.com`
- Sample vehicle: `AB12 CDE` (Ford Focus)
- Sample API key for testing

## 🔍 Verify Everything Works

### Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Check Sample Data
```sql
SELECT * FROM users WHERE email = 'test@example.com';
SELECT * FROM vehicles WHERE registration = 'AB12 CDE';
SELECT * FROM api_keys LIMIT 1;
```

### Test API Key Generation
```sql
SELECT generate_api_key();
```

## 🚨 Important Notes

### Environment Variables
Make sure these are set in your Vercel environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Authentication
The setup includes support for:
- Email/password authentication
- Session management
- User verification
- Premium user flags

### API Integration
Ready for:
- Stripe subscription management
- SMS/Email sending
- Rate limiting
- Activity tracking

## 🔄 Next Steps

1. **Test the APIs** - Your APIs should now work with the database
2. **Set up authentication** - Implement login/signup flows
3. **Connect Stripe** - Link subscription management
4. **Test email/SMS** - Verify communication works
5. **Monitor usage** - Check API usage and activity logs

## 🆘 Troubleshooting

### Common Issues

**"Table doesn't exist"**
- Make sure you ran the entire SQL script
- Check the SQL Editor for any error messages

**"Permission denied"**
- Verify RLS policies are created
- Check that your API keys are correct

**"Connection failed"**
- Verify your Supabase URL and keys
- Check your Vercel environment variables

### Need Help?
- Check the Supabase logs in your dashboard
- Verify all environment variables are set
- Test with the sample data first

## 📊 Database Schema Overview

```
users
├── id (SERIAL PRIMARY KEY)
├── email (VARCHAR UNIQUE)
├── name (VARCHAR)
├── phone (VARCHAR)
├── password_hash (VARCHAR)
├── is_verified (BOOLEAN)
├── is_premium (BOOLEAN)
├── stripe_customer_id (VARCHAR)
├── reminder_preferences (JSONB)
└── timestamps

vehicles
├── id (SERIAL PRIMARY KEY)
├── user_id (FOREIGN KEY)
├── registration (VARCHAR)
├── make (VARCHAR)
├── model (VARCHAR)
├── year (INTEGER)
├── mot_due_date (DATE)
├── tax_due_date (DATE)
├── insurance_due_date (DATE)
├── is_active (BOOLEAN)
└── timestamps

subscriptions
├── id (SERIAL PRIMARY KEY)
├── user_id (FOREIGN KEY)
├── stripe_subscription_id (VARCHAR)
├── status (VARCHAR)
├── plan_type (VARCHAR)
├── amount (INTEGER)
├── currency (VARCHAR)
├── current_period_start (TIMESTAMP)
├── current_period_end (TIMESTAMP)
└── timestamps

api_keys
├── id (SERIAL PRIMARY KEY)
├── user_id (FOREIGN KEY)
├── api_key (VARCHAR UNIQUE)
├── tier (VARCHAR)
├── organization_name (VARCHAR)
├── is_active (BOOLEAN)
└── timestamps
```

Your MOT Alert application is now ready with a complete, secure, and scalable database setup! 🎉 