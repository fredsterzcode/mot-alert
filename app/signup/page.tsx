'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import { 
  UserIcon, 
  TruckIcon, 
  BellIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

// Form schemas
const userInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const vehicleSchema = z.object({
  registration: z.string().min(2, 'Please enter a valid registration'),
})

const preferencesSchema = z.object({
  reminderType: z.enum(['email', 'sms']),
})

type UserInfo = z.infer<typeof userInfoSchema>
type Vehicle = z.infer<typeof vehicleSchema>
type Preferences = z.infer<typeof preferencesSchema>

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    userInfo: {} as UserInfo,
    vehicle: {} as Vehicle,
    preferences: {} as Preferences,
  })

  const userInfoForm = useForm<UserInfo>({
    resolver: zodResolver(userInfoSchema),
  })

  const vehicleForm = useForm<Vehicle>({
    resolver: zodResolver(vehicleSchema),
  })

  const preferencesForm = useForm<Preferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      reminderType: 'email',
    },
  })

  const onUserInfoSubmit = (data: UserInfo) => {
    setFormData(prev => ({ ...prev, userInfo: data }))
    setStep(2)
  }

  const onVehicleSubmit = (data: Vehicle) => {
    setFormData(prev => ({ ...prev, vehicle: data }))
    setStep(3)
  }

  const onPreferencesSubmit = (data: Preferences) => {
    setFormData(prev => ({ ...prev, preferences: data }))
    // TODO: Backend API integration
    console.log('Form submitted:', { ...formData, preferences: data })
    window.location.href = '/thank-you'
  }

  const goBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <Image
              src="/mot-alert-logo.png"
              alt="MOT Alert Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900">MOT Alert</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Get started with free MOT reminders</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > stepNumber ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step > stepNumber ? 'bg-primary-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: User Info */}
        {step === 1 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <UserIcon className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>
            
            <form onSubmit={userInfoForm.handleSubmit(onUserInfoSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...userInfoForm.register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
                {userInfoForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {userInfoForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...userInfoForm.register('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
                {userInfoForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {userInfoForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  {...userInfoForm.register('phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+44 7123 456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...userInfoForm.register('password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                {userInfoForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {userInfoForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
                disabled={userInfoForm.formState.isSubmitting}
              >
                Continue
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Vehicle Registration */}
        {step === 2 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <TruckIcon className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-xl font-semibold">Vehicle Information</h2>
            </div>
            
            <form onSubmit={vehicleForm.handleSubmit(onVehicleSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Registration
                </label>
                <input
                  type="text"
                  {...vehicleForm.register('registration')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="AB12 CDE"
                />
                {vehicleForm.formState.errors.registration && (
                  <p className="text-red-500 text-sm mt-1">
                    {vehicleForm.formState.errors.registration.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Enter your vehicle registration number (e.g., AB12 CDE)
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center"
                  disabled={vehicleForm.formState.isSubmitting}
                >
                  Continue
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Reminder Preferences */}
        {step === 3 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <BellIcon className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-xl font-semibold">Reminder Preferences</h2>
            </div>
            
            <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you like to receive reminders?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="email"
                      {...preferencesForm.register('reminderType')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Email Only (Free)</div>
                      <div className="text-sm text-gray-500">Receive reminders via email</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                    <input
                      type="radio"
                      value="sms"
                      disabled
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">SMS + Email (Premium)</div>
                      <div className="text-sm text-gray-500">Receive reminders via SMS and email</div>
                      <div className="text-xs text-primary-600 mt-1">Upgrade to Premium for SMS</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Free Plan:</strong> You'll receive email reminders for your MOT due date. 
                  Upgrade to Premium for SMS reminders and support for up to 3 vehicles.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center"
                  disabled={preferencesForm.formState.isSubmitting}
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 