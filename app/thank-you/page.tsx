import Link from 'next/link'
import { CheckCircle, Bell, Mail, Car } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-success-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-success-600" />
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-display mb-4">
              Welcome to MOT Alert!
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for signing up. We've sent you a confirmation email with your MOT details. 
              You'll receive reminders before your MOT is due.
            </p>
          </div>

          {/* What happens next */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              What happens next?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Confirmation Email</h3>
                <p className="text-gray-600 text-sm">
                  Check your inbox for a welcome email with your MOT details
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mb-4">
                  <Bell className="w-6 h-6 text-warning-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Timely Reminders</h3>
                <p className="text-gray-600 text-sm">
                  We'll send you reminders 1 month, 2 weeks, and 2 days before your MOT
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mb-4">
                  <Car className="w-6 h-6 text-success-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Stay Compliant</h3>
                <p className="text-gray-600 text-sm">
                  Never miss your MOT again and avoid fines or penalties
                </p>
              </div>
            </div>
          </div>

          {/* Reminder schedule */}
          <div className="bg-primary-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Your Reminder Schedule
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">1 Month Before</h3>
                    <p className="text-sm text-gray-600">Early warning to plan your MOT</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">SMS & Email</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-warning-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">2 Weeks Before</h3>
                    <p className="text-sm text-gray-600">Time to book your appointment</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">SMS & Email</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-danger-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-danger-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">2 Days Before</h3>
                    <p className="text-sm text-gray-600">Final reminder - don't forget!</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">SMS & Email</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-6">
            <p className="text-lg text-gray-600">
              Need to manage your reminders or add more vehicles?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 