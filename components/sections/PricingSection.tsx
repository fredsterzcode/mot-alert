'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '£0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      'Email reminders for MOT',
      '1 vehicle',
      'Basic dashboard',
      'Partner garage promotions',
      'Standard support'
    ],
    limitations: [
      'SMS reminders not included',
      'No custom schedules',
      'Limited to MOT reminders only'
    ],
    cta: 'Get Started Free',
    href: '/signup',
    popular: false
  },
  {
    name: 'Premium',
    price: '£1.99',
    period: '/month',
    description: 'Best value for serious drivers',
    features: [
      'SMS & Email reminders',
      'Up to 3 vehicles',
      'All reminder types (MOT, Tax, Insurance, Service)',
      'Ad-free experience',
      'Custom reminder schedules',
      'Priority support',
      '16% savings with annual plan'
    ],
    limitations: [],
    cta: 'Go Premium',
    href: '/subscription',
    popular: true
  }
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  const premiumPlan = plans[1]
  const displayPrice = annual ? '£19.99' : premiumPlan.price
  const displayPeriod = annual ? '/year' : premiumPlan.period

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mt-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <div className="flex">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  !annual
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  annual
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Save 16%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.name === 'Premium' ? displayPrice : plan.price}
                  </span>
                  <span className="text-gray-500">
                    {plan.name === 'Premium' ? displayPeriod : plan.period}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              <div className="mt-8">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start">
                      <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="ml-3 text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href={plan.href}
                  className={`w-full block text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include secure payment processing and 30-day money-back guarantee.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Need a custom plan for your garage?{' '}
            <Link href="/garage/signup" className="text-blue-600 hover:text-blue-700">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
} 