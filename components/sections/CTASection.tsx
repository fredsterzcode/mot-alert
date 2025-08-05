import Link from 'next/link'
import { Bell, Shield, Clock } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Bell className="w-4 h-4 mr-2" />
            Join 50,000+ drivers
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-6">
            Never Miss Your MOT Again
          </h2>
          
          <p className="text-xl text-primary-100 leading-relaxed max-w-2xl mx-auto">
            Get free reminders for your MOT, tax, and insurance. Sign up in 30 seconds and stay compliant with the law.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-sm">Free forever</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-sm">30-second setup</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-sm">Timely reminders</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Get Free Reminders
          </Link>
          <Link
            href="/garage"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors font-semibold text-lg"
          >
            For Garages
          </Link>
        </div>

        <div className="text-sm text-primary-200">
          <p>No credit card required • Cancel anytime • GDPR compliant</p>
        </div>
      </div>
    </section>
  )
} 