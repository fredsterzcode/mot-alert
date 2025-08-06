'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckIcon, 
  XMarkIcon,
  StarIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import MobileNav from '@/components/MobileNav'

export default function SubscriptionPage() {
  const handleUpgrade = async (planType: string) => {
    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'user@example.com', // This should come from user session
          name: 'User Name', // This should come from user session
          planType: planType
        }),
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = result.url;
      } else {
        alert('Failed to create checkout session: ' + result.error);
      }
    } catch (error) {
      alert('Error setting up payment: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-gray-600">
              Start free, upgrade when you need more features
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gray-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  £0<span className="text-lg text-gray-500">/month</span>
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Email reminders for MOT</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>1 vehicle</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Partner garage ads</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Basic dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-500">SMS reminders</span>
                  </li>
                  <li className="flex items-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-500">Multiple vehicles</span>
                  </li>
                  <li className="flex items-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-500">Custom schedules</span>
                  </li>
                  <li className="flex items-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-500">Priority support</span>
                  </li>
                </ul>
                
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    You're currently on the Free plan
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-500 p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <StarIcon className="w-4 h-4 mr-1" />
                  Most Popular
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  £2.99<span className="text-lg text-gray-500">/month</span>
                </div>
                <div className="text-sm text-orange-600 mb-4">
                  or £29.99/year (17% savings)
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>SMS + Email reminders</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Up to 3 vehicles</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Ad-free experience</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Custom schedules</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Tax & insurance reminders</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Service due reminders</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
                
                <button 
                  onClick={() => handleUpgrade('premium')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center mb-4"
                >
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Feature Comparison
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4 text-gray-900">Email Reminders</td>
                    <td className="py-3 px-4 text-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-900">SMS Reminders</td>
                    <td className="py-3 px-4 text-center">
                      <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-900">Number of Vehicles</td>
                    <td className="py-3 px-4 text-center text-gray-900">1</td>
                    <td className="py-3 px-4 text-center text-gray-900">Up to 3</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-900">Ad-Free Experience</td>
                    <td className="py-3 px-4 text-center">
                      <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-900">Custom Schedules</td>
                    <td className="py-3 px-4 text-center">
                      <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-900">Priority Support</td>
                    <td className="py-3 px-4 text-center">
                      <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-900">Tax & Insurance Reminders</td>
                    <td className="py-3 px-4 text-center">
                      <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How much does MOT Alert cost for drivers?
                </h3>
                <p className="text-gray-600">
                  The Free tier offers email reminders for one vehicle with partner garage promotions. 
                  The Premium tier (£2.99/month or £29.99/year) includes SMS and email reminders for 
                  up to 3 vehicles, ad-free, with custom schedules and priority support.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What's the difference between Free and Premium tiers?
                </h3>
                <p className="text-gray-600">
                  The Free tier provides email-only reminders for one vehicle with ads. 
                  The Premium tier adds SMS reminders, supports up to 3 vehicles, and is ad-free 
                  with customizable schedules.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I upgrade to Premium?
                </h3>
                <p className="text-gray-600">
                  From your dashboard, click 'Upgrade to Premium' to subscribe via secure payment through Stripe.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel your Premium subscription at any time. You'll continue to have access 
                  until the end of your current billing period.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-8">
            <p className="text-lg text-gray-600 mb-4">
              Ready to upgrade? Get started with Premium today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg">
                Back to Dashboard
              </Link>
              <button 
                onClick={() => handleUpgrade('premium')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <CreditCardIcon className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 