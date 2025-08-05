'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Car, Shield, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { SignupForm } from '@/components/forms/SignupForm'

export function HeroSection() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (formData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Successfully signed up! Check your email for confirmation.')
        router.push('/thank-you')
      } else {
        toast.error(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-blue-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                <Bell className="w-4 h-4 mr-2" />
                Never miss your MOT again
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 font-display leading-tight">
                MOT Reminders by{' '}
                <span className="text-primary-600">Text</span> or{' '}
                <span className="text-primary-600">Email</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Get timely reminders for your vehicle's MOT, tax, and insurance. 
                Free for drivers, powerful white-label solutions for garages.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-success-600" />
                </div>
                <span className="text-sm text-gray-600">Free for drivers</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-warning-600" />
                </div>
                <span className="text-sm text-gray-600">Timely reminders</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Car className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-sm text-gray-600">All vehicles</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.9/5 from 500+ reviews</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">TP</span>
                </div>
                <span className="text-sm text-gray-600">TrustPilot</span>
              </div>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div className="lg:pl-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Your Free MOT Reminders
                </h2>
                <p className="text-gray-600">
                  Sign up in 30 seconds, never miss your MOT again
                </p>
              </div>

              <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{' '}
                  <a href="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms" className="text-primary-600 hover:underline">
                    Terms of Service
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-success-100 rounded-full opacity-20 blur-3xl"></div>
    </section>
  )
} 