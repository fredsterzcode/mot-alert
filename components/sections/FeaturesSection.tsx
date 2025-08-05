import { Bell, Shield, Clock, Car, MessageSquare, Users, Zap, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: Bell,
    title: 'Timely Reminders',
    description: 'Get notified 1 month, 2 weeks, and 2 days before your MOT is due. Never miss a deadline again.',
    color: 'primary'
  },
  {
    icon: Shield,
    title: 'Free for Drivers',
    description: 'No hidden costs or subscriptions. MOT reminders are completely free for individual drivers.',
    color: 'success'
  },
  {
    icon: Clock,
    title: 'Multiple Channels',
    description: 'Receive reminders via SMS, email, or both. Choose what works best for you.',
    color: 'warning'
  },
  {
    icon: Car,
    title: 'All Vehicle Types',
    description: 'Works with cars, vans, motorcycles, and commercial vehicles. Any UK registered vehicle.',
    color: 'primary'
  },
  {
    icon: MessageSquare,
    title: 'White-Label for Garages',
    description: 'Garages can send branded reminders to their customers with custom messaging.',
    color: 'success'
  },
  {
    icon: Users,
    title: 'Bulk Management',
    description: 'Garages can manage hundreds of customer vehicles from one dashboard.',
    color: 'warning'
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Sign up in 30 seconds. Just enter your registration and contact details.',
    color: 'primary'
  },
  {
    icon: CheckCircle,
    title: 'Reliable Service',
    description: 'Trusted by thousands of drivers and garages across the UK.',
    color: 'success'
  }
]

const colorClasses = {
  primary: 'bg-primary-100 text-primary-600',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  danger: 'bg-danger-100 text-danger-600',
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-display mb-4">
            Why Choose MOT Alert?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We make MOT management simple and stress-free for both drivers and garages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${colorClasses[feature.color as keyof typeof colorClasses]} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Additional benefits */}
        <div className="mt-20 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 font-display mb-6">
                For Garages: White-Label Solution
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Send branded MOT reminders to your customers with your logo, contact details, and custom messaging. 
                Increase customer retention and bookings with automated follow-ups.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
                  <span className="text-gray-700">Custom branding and messaging</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
                  <span className="text-gray-700">Bulk customer management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
                  <span className="text-gray-700">Message history and analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
                  <span className="text-gray-700">Flexible pricing plans</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Car className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Sample Reminder</h4>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p className="text-gray-700 mb-2">
                  "Hi John, your MOT for AB12 CDE is due on 21 Sept. 
                  Book now with Fast Fit Garage. Call 01234 567890 or visit fastfitgarage.co.uk"
                </p>
                <div className="text-xs text-gray-500">
                  Sent via SMS • 2 days before due date
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 