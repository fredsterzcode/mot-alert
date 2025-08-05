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
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

// Form schemas
const userInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const vehicleSchema = z.object({
  registration: z.string().min(2, 'Please enter a valid registration').toUpperCase(),
})

const preferencesSchema = z.object({
  reminderType: z.enum(['email', 'sms']),
})

type UserInfo = z.infer<typeof userInfoSchema>
type Vehicle = z.infer<typeof vehicleSchema>
type Preferences = z.infer<typeof preferencesSchema>

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

  const onPreferencesSubmit = async (data: Preferences) => {
    setIsLoading(true)
    setFormData(prev => ({ ...prev, preferences: data }))
    
    try {
      // TODO: Backend API integration
      console.log('Form submitted:', { ...formData, preferences: data })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      window.location.href = '/thank-you'
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <Image
              src="/mot-alert-logo.png"
              alt="MOT Alert Logo"
              width={48}
              height={48}
              className="rounded-xl shadow-lg"
            />
            <span className="text-2xl font-bold text-gray-900">MOT Alert</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Get started with free MOT reminders</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                step >= stepNumber 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > stepNumber ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-200 ${
                  step > stepNumber ? 'bg-orange-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: User Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <UserIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-600">Tell us about yourself</p>
              </div>
            </div>
            
            <form onSubmit={userInfoForm.handleSubmit(onUserInfoSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  {...userInfoForm.register('name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="John Doe"
                />
                {userInfoForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {userInfoForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...userInfoForm.register('email')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="john@example.com"
                />
                {userInfoForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {userInfoForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  {...userInfoForm.register('phone')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="+44 7123 456789"
                />
                <p className="text-xs text-gray-500 mt-1">For SMS reminders (Premium feature)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...userInfoForm.register('password')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {userInfoForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {userInfoForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...userInfoForm.register('confirmPassword')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {userInfoForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {userInfoForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                disabled={userInfoForm.formState.isSubmitting}
              >
                Continue
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Vehicle Registration */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <TruckIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Vehicle Information</h2>
                <p className="text-sm text-gray-600">Add your first vehicle</p>
              </div>
            </div>
            
            <form onSubmit={vehicleForm.handleSubmit(onVehicleSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Registration
                </label>
                <input
                  type="text"
                  {...vehicleForm.register('registration')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors font-mono text-lg"
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> You can add more vehicles later from your dashboard.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                  disabled={vehicleForm.formState.isSubmitting}
                >
                  Continue
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Reminder Preferences */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <BellIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Reminder Preferences</h2>
                <p className="text-sm text-gray-600">Choose how you want to be notified</p>
              </div>
            </div>
            
            <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you like to receive reminders?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      value="email"
                      {...preferencesForm.register('reminderType')}
                      className="mr-3 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Email Only (Free)</div>
                      <div className="text-sm text-gray-500">Receive reminders via email</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-60">
                    <input
                      type="radio"
                      value="sms"
                      disabled
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">SMS + Email (Premium)</div>
                      <div className="text-sm text-gray-500">Receive reminders via SMS and email</div>
                      <div className="text-xs text-orange-600 mt-1 font-medium">Upgrade to Premium for SMS</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Free Plan:</strong> You'll receive email reminders for your MOT due date. 
                  Upgrade to Premium for SMS reminders and support for up to 3 vehicles.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 