# Supabase Database Setup Guide

## Step 1: Open Supabase Dashboard
1. Go to your Vercel project → Storage → Supabase
2. Click **"Open in Supabase"**
3. Go to **Table Editor**

## Step 2: Create Database Tables

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  name VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  registration VARCHAR(20) NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  mot_due_date DATE,
  tax_due_date DATE,
  insurance_due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table (SMS)
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  message_text TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Emails Table
```sql
CREATE TABLE emails (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'active',
  plan_type VARCHAR(20) DEFAULT 'premium',
  amount INTEGER DEFAULT 199,
  currency VARCHAR(3) DEFAULT 'GBP',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Keys Table
```sql
CREATE TABLE api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  tier VARCHAR(20) NOT NULL DEFAULT 'BASIC',
  organization_name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Usage Table
```sql
CREATE TABLE api_usage (
  id SERIAL PRIMARY KEY,
  api_key VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  request_count INTEGER DEFAULT 1,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(api_key, date)
);
```

## Step 3: Test Your APIs

### Test User Creation
```bash
curl -X POST https://your-site.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "John Doe"}'
```

### Test Vehicle Addition
```bash
curl -X POST https://your-site.vercel.app/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "registration": "ABC123",
    "make": "Ford",
    "model": "Focus",
    "year": 2019,
    "motDueDate": "2024-12-31"
  }'
```

### Test API Key Creation
```bash
curl -X POST https://your-site.vercel.app/api/keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-session-token" \
  -d '{"tier": "BASIC", "organizationName": "Test Garage"}'
```

## Step 4: Verify Everything Works

1. **Check database tables** are created
2. **Test API endpoints** return expected responses
3. **Verify environment variables** are set correctly
4. **Test email/SMS** functionality

## Step 5: Deploy and Monitor

1. **Push any changes** to GitHub
2. **Monitor Vercel deployment**
3. **Check logs** for any errors
4. **Test live endpoints**

## Troubleshooting

### Common Issues:
- **Database connection errors**: Check environment variables
- **API key errors**: Verify Supabase setup
- **Email/SMS failures**: Check service credentials
- **Rate limiting**: Verify API tier settings

### Support:
- **Supabase docs**: https://supabase.com/docs
- **Vercel logs**: Check deployment logs
- **API testing**: Use Postman or curl 