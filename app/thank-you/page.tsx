'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircleIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  BellIcon,
  TruckIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function ThankYouPage() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Animate content in after a short delay
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Animation */}
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12 mb-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-green-100 rounded-full p-6">
                <CheckCircleIcon className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Main Content */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to MOT Alert! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your account has been created successfully. You're all set to never miss your MOT again!
            </p>

            {/* What's Next */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 rounded-full p-2">
                    <EnvelopeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Check your email</p>
                    <p className="text-sm text-gray-600">We've sent you a welcome email with next steps</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 rounded-full p-2">
                    <BellIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Reminders scheduled</p>
                    <p className="text-sm text-gray-600">Your MOT reminders are now active</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 rounded-full p-2">
                    <TruckIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Vehicle added</p>
                    <p className="text-sm text-gray-600">Your vehicle is now being monitored</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link 
                href="/dashboard"
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Go to Dashboard
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <div className="text-sm text-gray-500">
                You'll be redirected automatically in 10 seconds
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Plan</h3>
              <p className="text-sm text-gray-600">
                Start with email reminders for 1 vehicle. Perfect for getting started.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <BellIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Features</h3>
              <p className="text-sm text-gray-600">
                Upgrade for SMS reminders and support for up to 3 vehicles.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add More Vehicles</h3>
              <p className="text-sm text-gray-600">
                Manage multiple vehicles from your dashboard anytime.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Need help? Contact our support team
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/contact" className="text-orange-600 hover:text-orange-700 font-medium">
                Contact Support
              </Link>
              <Link href="/faq" className="text-orange-600 hover:text-orange-700 font-medium">
                FAQ
              </Link>
              <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 