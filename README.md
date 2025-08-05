# MOT Alert - MOT & Tax Reminder Service

A modern SaaS platform for MOT and tax reminders, built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Features

- **Free Tier**: Email reminders for 1 vehicle with partner garage ads
- **Premium Tier**: SMS + Email reminders for up to 3 vehicles, ad-free experience
- **Multi-step Signup**: Easy registration process with form validation
- **User Dashboard**: Manage vehicles and reminder preferences
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Modern UI**: Beautiful design with orange brand colors and Inter font

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Forms**: React Hook Form with Zod validation
- **Icons**: Heroicons
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mot-alert
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mot-alert/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # User dashboard
│   ├── signup/           # Multi-step signup form
│   ├── subscription/     # Pricing page
│   ├── thank-you/        # Confirmation page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   └── FAQ.tsx          # FAQ accordion component
├── public/               # Static assets
│   └── mot-alert-logo.png
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
```

## Pages

### Landing Page (`/`)
- Hero section with call-to-action
- Pricing comparison (Free vs Premium)
- Features and testimonials
- FAQ section
- Footer with navigation

### Signup Page (`/signup`)
- Multi-step form with validation
- User information collection
- Vehicle registration
- Reminder preferences
- Redirects to thank-you page

### Dashboard (`/dashboard`)
- User information display
- Subscription status
- Vehicle management
- Reminder preferences
- Quick actions

### Subscription Page (`/subscription`)
- Detailed pricing comparison
- Feature breakdown
- Upgrade options
- FAQ section

### Thank You Page (`/thank-you`)
- Confirmation message
- Mock data display
- Navigation to dashboard

## Brand Colors

- **Primary (Orange)**: `#F97316` - Matches logo
- **Secondary (Green)**: `#10B981` - Success/accent color
- **Font**: Inter - Clean, modern typography

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link to a new Vercel project:
```bash
vercel link
```

4. Add environment variables in Vercel Dashboard:
   - Go to Settings > Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your API URL

5. Deploy to production:
```bash
vercel --prod
```

### Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL="https://api.example.com"
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form for form management
- Zod for validation schemas

## Backend Integration

This is a frontend-only implementation with mock data. For production, you'll need to integrate:

- **Database**: Prisma with PostgreSQL
- **Authentication**: NextAuth.js or similar
- **Payments**: Stripe Checkout
- **Email**: SendGrid or similar
- **SMS**: Twilio
- **Scheduling**: Cron jobs for reminders

## Mock Data

The application uses mock data for demonstration:

```typescript
// User data
const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  plan: "Free"
}

// Vehicle data
const mockVehicles = [
  {
    registration: "AB12 CDE",
    motDueDate: "2026-03-15",
    daysUntilDue: 45
  }
]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@mot-alert.com or create an issue in this repository.

---

Built with ❤️ using Next.js, React, and Tailwind CSS 