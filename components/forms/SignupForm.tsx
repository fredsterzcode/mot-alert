'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { validateRegistration, formatRegistration } from '@/lib/utils'
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  registration: z.string().min(2, 'Registration is required'),
  reminderType: z.enum(['SMS', 'EMAIL', 'BOTH']),
  preferences: z.object({
    mot: z.boolean(),
    tax: z.boolean(),
    insurance: z.boolean(),
    service: z.boolean(),
    sms: z.boolean(),
    email: z.boolean(),
  }),
})

type SignupFormData = z.infer<typeof signupSchema>

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void
  isLoading?: boolean
}

export function SignupForm({ onSubmit, isLoading = false }: SignupFormProps) {
  const [step, setStep] = useState(1)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      reminderType: 'BOTH',
      preferences: {
        mot: true,
        tax: false,
        insurance: false,
        service: false,
        sms: true,
        email: true,
      },
    },
  })

  const watchedRegistration = watch('registration')
  const watchedReminderType = watch('reminderType')
  const watchedPreferences = watch('preferences')

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setValue('registration', value)
  }

  const handleReminderTypeChange = (type: 'SMS' | 'EMAIL' | 'BOTH') => {
    setValue('reminderType', type)
    setValue('preferences.sms', type === 'SMS' || type === 'BOTH')
    setValue('preferences.email', type === 'EMAIL' || type === 'BOTH')
  }

  const onFormSubmit = (data: SignupFormData) => {
    // Format registration
    data.registration = formatRegistration(data.registration)
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="John Smith"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="07123 456789"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="registration" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Registration
            </label>
            <input
              {...register('registration')}
              type="text"
              id="registration"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase"
              placeholder="AB12 CDE"
              onChange={handleRegistrationChange}
              value={watchedRegistration || ''}
            />
            {errors.registration && (
              <p className="mt-1 text-sm text-red-600">{errors.registration.message}</p>
            )}
            {watchedRegistration && !validateRegistration(watchedRegistration) && (
              <p className="mt-1 text-sm text-amber-600">
                Please enter a valid UK registration number
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!watchedRegistration || !validateRegistration(watchedRegistration)}
            className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Reminder Preferences */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How would you like to receive reminders?
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  {...register('reminderType')}
                  value="SMS"
                  className="mr-3"
                  onChange={() => handleReminderTypeChange('SMS')}
                />
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="font-medium">SMS only</span>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  {...register('reminderType')}
                  value="EMAIL"
                  className="mr-3"
                  onChange={() => handleReminderTypeChange('EMAIL')}
                />
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="font-medium">Email only</span>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  {...register('reminderType')}
                  value="BOTH"
                  className="mr-3"
                  onChange={() => handleReminderTypeChange('BOTH')}
                />
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="font-medium">Both SMS & Email</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What would you like reminders for?
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('preferences.mot')}
                  className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">MOT due date</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('preferences.tax')}
                  className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Road tax due date</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('preferences.insurance')}
                  className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Insurance renewal</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('preferences.service')}
                  className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Service due date</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing up...' : 'Get Free Reminders'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
} 