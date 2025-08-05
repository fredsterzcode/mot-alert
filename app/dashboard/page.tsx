'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Car, 
  Bell, 
  Crown, 
  Plus, 
  Settings, 
  CreditCard,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface Vehicle {
  id: string
  registration: string
  make?: string
  model?: string
  motExpiryDate: string
  taxExpiryDate?: string
  insuranceExpiryDate?: string
  serviceDueDate?: string
}

interface Subscription {
  id: string
  plan: string
  status: string
  currentPeriodEnd?: string
  usageCount: number
  reminderLimit?: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/signin')
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const [vehiclesRes, subscriptionRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/user/subscription')
      ])

      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        setVehicles(vehiclesData.vehicles)
      }

      if (subscriptionRes.ok) {
        const subscriptionData = await subscriptionRes.json()
        setSubscription(subscriptionData.subscription)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    router.push('/subscription')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isPremium = subscription?.plan === 'DRIVER_PREMIUM'
  const isActive = subscription?.status === 'ACTIVE'
  const vehicleLimit = isPremium ? 3 : 1
  const canAddVehicle = vehicles.length < vehicleLimit

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session?.user?.name || 'Driver'}
          </p>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {isPremium ? (
                <Crown className="h-6 w-6 text-blue-600 mr-3" />
              ) : (
                <Bell className="h-6 w-6 text-gray-600 mr-3" />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isPremium ? 'Premium Plan' : 'Free Plan'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isActive ? 'Active' : subscription?.status || 'Inactive'}
                </p>
              </div>
            </div>
            {!isPremium && (
              <button
                onClick={handleUpgrade}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade to Premium
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Vehicles:</span>
              <span className="ml-2 font-medium">
                {vehicles.length}/{vehicleLimit}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Reminders:</span>
              <span className="ml-2 font-medium">
                {isPremium ? 'SMS & Email' : 'Email only'}
              </span>
            </div>
            {isPremium && (
              <div>
                <span className="text-gray-600">Next billing:</span>
                <span className="ml-2 font-medium">
                  {subscription?.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            )}
          </div>

          {isPremium && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/subscription"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Subscription
              </Link>
            </div>
          )}
        </div>

        {/* Vehicles Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Vehicles</h2>
            {canAddVehicle && (
              <Link
                href="/vehicles/add"
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Link>
            )}
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No vehicles added yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add your first vehicle to start receiving MOT reminders
              </p>
              <Link
                href="/vehicles/add"
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {vehicle.registration}
                      </h3>
                      {vehicle.make && vehicle.model && (
                        <p className="text-sm text-gray-600">
                          {vehicle.make} {vehicle.model}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        MOT: {new Date(vehicle.motExpiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!canAddVehicle && vehicles.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Vehicle limit reached
                  </p>
                  <p className="text-sm text-yellow-700">
                    Upgrade to Premium to add up to 3 vehicles
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage your reminder preferences and account settings
            </p>
            <Link
              href="/settings"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              Go to Settings
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Reminders</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View your upcoming reminders and message history
            </p>
            <Link
              href="/reminders"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              View Reminders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 