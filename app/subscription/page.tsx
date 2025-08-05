'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Check, Crown, CreditCard, Shield } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/signin')
      return
    }

    fetchSubscription()
  }, [session, status, router])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const handleUpgrade = async (planId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userType: 'driver',
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        toast.error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!subscription?.stripeCustomerId) {
      toast.error('No active subscription found')
      return
    }

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: subscription.stripeCustomerId,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        toast.error('Failed to access customer portal')
      }
    } catch (error) {
      console.error('Error accessing customer portal:', error)
      toast.error('Something went wrong')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isPremium = subscription?.plan === 'DRIVER_PREMIUM'
  const isActive = subscription?.status === 'ACTIVE'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage your MOT Alert subscription and upgrade options
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Current Plan</h2>
              <p className="text-gray-600 mt-1">
                {isPremium ? 'Premium Plan' : 'Free Plan'}
              </p>
            </div>
            {isPremium && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <Crown className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Premium</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Plan Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={isActive ? 'text-green-600' : 'text-red-600'}>
                    {isActive ? 'Active' : subscription?.status || 'Inactive'}
                  </span>
                </div>
                {isPremium && (
                  <>
                    <div className="flex justify-between">
                      <span>Billing Cycle:</span>
                      <span>Monthly/Annual</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Billing:</span>
                      <span>
                        {subscription?.currentPeriodEnd
                          ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <div className="space-y-2 text-sm">
                {isPremium ? (
                  <>
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span>SMS & Email reminders</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Up to 3 vehicles</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span>All reminder types</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Ad-free experience</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-gray-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Email reminders only</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span>1 vehicle</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span>MOT reminders only</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Partner promotions</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {isPremium && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleManageSubscription}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </button>
            </div>
          )}
        </div>

        {/* Upgrade Options */}
        {!isPremium && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upgrade to Premium
              </h2>
              <p className="text-gray-600">
                Get SMS reminders, support for up to 3 vehicles, and ad-free experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Monthly</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">£1.99</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <button
                  onClick={() => handleUpgrade('price_driver_premium_monthly')}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Upgrade Monthly'}
                </button>
              </div>

              <div className="border-2 border-blue-500 rounded-lg p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </span>
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Annual</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">£19.99</span>
                    <span className="text-gray-500">/year</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Save 16%</p>
                </div>
                <button
                  onClick={() => handleUpgrade('price_driver_premium_annual')}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Upgrade Annual'}
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure payment processing</span>
              </div>
              <p>30-day money-back guarantee • Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 