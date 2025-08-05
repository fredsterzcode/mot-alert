# MOT Alert - MOT Reminder SaaS Platform

A comprehensive MOT reminder service for drivers and white-label solution for garages. Built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

### For Drivers
#### Free Tier
- **MOT Reminders**: Email notifications 1 month, 2 weeks, and 2 days before due
- **1 Vehicle**: Support for one vehicle registration
- **Partner Promotions**: Includes garage recommendations in emails
- **Basic Dashboard**: Manage your vehicle and preferences

#### Premium Tier (£1.99/month or £19.99/year)
- **SMS & Email Reminders**: Get notified via both channels
- **Up to 3 Vehicles**: Manage multiple vehicles
- **All Reminder Types**: MOT, Tax, Insurance, and Service due dates
- **Ad-Free Experience**: No partner promotions
- **Custom Schedules**: Set your own reminder preferences
- **Priority Support**: Faster response times
- **16% Savings**: Annual billing option

### For Garages (Paid Plans)
- **White-Label Solution**: Send branded reminders with your logo and contact details
- **Bulk Management**: Manage hundreds of customer vehicles from one dashboard
- **Custom Messaging**: Personalized reminder text for each garage
- **Analytics**: Track message delivery and customer engagement
- **Flexible Pricing**: Starter (£15), Pro (£45), Premium (£99) plans

### Admin Features
- **Dashboard**: Monitor total users, garages, and system metrics
- **Message Queue**: Track and retry failed SMS/emails
- **Billing Management**: Monitor subscription status and usage
- **System Announcements**: Send notifications to all users

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Messaging**: Twilio (SMS), SendGrid (Email)
- **Billing**: Stripe for subscription management
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Twilio account (for SMS)
- SendGrid account (for email)
- Stripe account (for billing)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/mot-alert.git
cd mot-alert
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mot_alert"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_DRIVER_PREMIUM_MONTHLY="price_driver_premium_monthly"
STRIPE_DRIVER_PREMIUM_ANNUAL="price_driver_premium_annual"

# Twilio
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+44123456789"

# SendGrid
SENDGRID_API_KEY="SG..."
SENDGRID_FROM_EMAIL="noreply@mot-alert.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set up the database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Set up Stripe Products
Create the following products in your Stripe dashboard:

#### Driver Premium Plans
- **Monthly Premium**: £1.99/month recurring
- **Annual Premium**: £19.99/year recurring

#### Garage Plans
- **Starter**: £15/month (100 reminders)
- **Pro**: £45/month (500 reminders)  
- **Premium**: £99/month (unlimited)

### 6. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 💰 Pricing Model

### Driver Pricing
- **Free Tier**: £0/month - Email reminders for 1 vehicle
- **Premium Tier**: £1.99/month or £19.99/year - SMS & email for up to 3 vehicles

### Garage Pricing  
- **Starter**: £15/month - 100 reminders
- **Pro**: £45/month - 500 reminders
- **Premium**: £99/month - Unlimited reminders

## 🔧 Configuration

### Stripe Setup
1. Create a Stripe account and get your API keys
2. Set up webhook endpoints for subscription events
3. Create products and prices for all subscription tiers
4. Configure the webhook secret in your environment variables

### Twilio Setup
1. Create a Twilio account and get your credentials
2. Verify your sender phone number for SMS
3. Configure the credentials in your environment variables

### SendGrid Setup
1. Create a SendGrid account and get your API key
2. Verify your sender email address
3. Configure the API key in your environment variables

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Migration
```bash
# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### Cron Jobs
Set up daily cron jobs for reminder processing:

```bash
# Process due reminders
curl -X POST https://your-domain.vercel.app/api/reminders

# Retry failed messages  
curl -X POST https://your-domain.vercel.app/api/reminders/retry
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Drivers
- `POST /api/users/signup` - Driver registration
- `GET /api/user/subscription` - Get subscription status
- `GET /api/vehicles` - Get user vehicles
- `POST /api/stripe/checkout` - Create checkout session

### Garages
- `POST /api/garages/signup` - Garage registration
- `GET /api/garages/dashboard` - Garage dashboard data

### Reminders
- `POST /api/reminders` - Process due reminders
- `GET /api/reminders` - Get user reminders

### Stripe
- `POST /api/stripe/webhook` - Handle Stripe events
- `POST /api/stripe/portal` - Customer portal access

## 🔒 Security

- **Authentication**: NextAuth.js with secure session management
- **Database**: Prisma ORM with parameterized queries
- **Payments**: Stripe PCI DSS compliant processing
- **Environment**: Secure environment variable management
- **CORS**: Configured for production domains only

## 📈 Monitoring

- **Error Tracking**: Console logging with structured data
- **Performance**: Vercel Analytics integration
- **Uptime**: Vercel built-in monitoring
- **Database**: Prisma query performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@mot-alert.com
- **Documentation**: [docs.mot-alert.com](https://docs.mot-alert.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/mot-alert/issues)

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Driver Free & Premium tiers
- ✅ Garage white-label solution
- ✅ Stripe subscription management
- ✅ SMS & Email reminders

### Phase 2 (Next)
- [ ] WhatsApp integration
- [ ] Calendar sync (Google/Apple)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics

### Phase 3 (Future)
- [ ] AI-powered reminder optimization
- [ ] Multi-language support
- [ ] API for third-party integrations
- [ ] Advanced garage features 