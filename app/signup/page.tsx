'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import MobileNav from '@/components/MobileNav'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.enum(['free', 'premium', 'partner']),
  companyName: z.string().optional(),
  companyDescription: z.string().optional(),
  website: z.string().url().optional().or(z.literal(''))
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userType, setUserType] = useState<'free' | 'premium' | 'partner'>('free')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: 'free'
    }
  })

  const watchedUserType = watch('userType')

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    setError('')
    
    try {
      // For free tier, create account with Supabase Auth
      if (data.userType === 'free') {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            name: data.name,
            phone: data.phone,
            userType: 'individual'
          }),
        })

        const result = await response.json()

        if (result.success) {
          window.location.href = '/dashboard'
        } else {
          setError(result.error || 'Signup failed')
        }
      } else {
        // For premium/partner, create checkout session
        const response = await fetch('/api/subscriptions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            name: data.name,
            planType: data.userType === 'premium' ? 'premium' : 'whitelabel',
            phone: data.phone,
            companyName: data.companyName,
            companyDescription: data.companyDescription,
            website: data.website
          }),
        })

        const result = await response.json()

        if (result.success) {
          // Redirect to Stripe checkout
          window.location.href = result.url
        } else {
          setError(result.error || 'Payment setup failed')
        }
      }
    } catch (err) {
      setError('Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header with Mobile Nav */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/mot-alert-logo.png"
                alt="MOT Alert Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-sm"
              />
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-gray-900">MOT Alert</div>
                <div className="text-xs text-gray-500">Mot & Tax Reminder</div>
              </div>
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Choose how you want to use MOT Alert</p>
          </div>

          {/* User Type Selection */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">I want to...</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Free Tier */}
              <label className={`relative cursor-pointer ${watchedUserType === 'free' ? 'ring-2 ring-orange-500' : ''}`}>
                <input
                  type="radio"
                  value="free"
                  {...register('userType')}
                  className="sr-only"
                />
                <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Free MOT Reminders</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Get basic email reminders for my vehicle MOT
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Free email reminders
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      1 vehicle included
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Basic dashboard
                    </div>
                    <div className="text-lg font-bold text-green-600 mt-3">
                      £0/month
                    </div>
                  </div>
                </div>
              </label>

              {/* Premium */}
              <label className={`relative cursor-pointer ${watchedUserType === 'premium' ? 'ring-2 ring-orange-500' : ''}`}>
                <input
                  type="radio"
                  value="premium"
                  {...register('userType')}
                  className="sr-only"
                />
                <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Premium Service</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Get SMS reminders and track multiple vehicles
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      SMS + Email reminders
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Up to 3 vehicles
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Priority support
                    </div>
                    <div className="text-lg font-bold text-orange-600 mt-3">
                      £2.99/month
                    </div>
                  </div>
                </div>
              </label>

              {/* Partner */}
              <label className={`relative cursor-pointer ${watchedUserType === 'partner' ? 'ring-2 ring-orange-500' : ''}`}>
                <input
                  type="radio"
                  value="partner"
                  {...register('userType')}
                  className="sr-only"
                />
                <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">White-Label Service</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    I'm a garage and want to offer MOT Alert to my customers
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      100 vehicles included free
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      £2.99 per additional vehicle
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      White-label branding
                    </div>
                    <div className="text-lg font-bold text-blue-600 mt-3">
                      £49.99/month
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Create a password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Partner-specific fields */}
              {watchedUserType === 'partner' && (
                <>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      {...register('companyName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Enter your company name"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description
                    </label>
                    <textarea
                      id="companyDescription"
                      {...register('companyDescription')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Brief description of your business"
                    />
                    {errors.companyDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <input
                      id="website"
                      type="url"
                      {...register('website')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="https://your-website.com"
                    />
                    {errors.website && (
                      <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {watchedUserType === 'free' ? 'Creating account...' : 'Setting up payment...'}
                  </div>
                ) : (
                  <>
                    {watchedUserType === 'free' ? 'Create Free Account' : 'Continue to Payment'}
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 