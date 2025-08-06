'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import Image from 'next/image'
import { 
  UserIcon, 
  TruckIcon, 
  BellIcon,
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import MobileNav from '@/components/MobileNav'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  isVerified: boolean
  isPremium: boolean
  isPartner: boolean
}

interface Vehicle {
  id: number
  registration: string
  make?: string
  model?: string
  year?: number
  mot_due_date?: string
  tax_due_date?: string
  insurance_due_date?: string
  created_at: string
}

interface Subscription {
  id: number
  plan_type: 'FREE' | 'PREMIUM'
  status: 'active' | 'cancelled' | 'past_due'
  current_period_end?: string
  addons?: any[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ 
    registration: '',
    make: '',
    model: '',
    year: '',
    motDueDate: '',
    taxDueDate: '',
    insuranceDueDate: ''
  })
  const [showAutoRenewalModal, setShowAutoRenewalModal] = useState(false)
  const [autoRenewalData, setAutoRenewalData] = useState({ addonId: null, autoRenew: false })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Get the access token from localStorage
      const accessToken = localStorage.getItem('supabase.auth.token')
      
      if (!accessToken) {
        console.log('No access token found, redirecting to login')
        window.location.href = '/login'
        return
      }

      // Get user data with authentication token
      const userResponse = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      const userData = await userResponse.json()
      console.log('User data response:', userData)
      
      if (userData.success) {
        setUser(userData.user)
        
        // If user is a partner, redirect to partner dashboard
        if (userData.user.isPartner) {
          window.location.href = '/partner'
          return
        }
        
        // Fetch user's vehicles
        fetchVehicles(userData.user.id)
        fetchSubscription(userData.user.id)
      } else {
        console.log('User data fetch failed:', userData.error)
        // Not authenticated, redirect to login
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  const fetchVehicles = async (userId: string) => {
    try {
      const accessToken = localStorage.getItem('supabase.auth.token')
      const response = await fetch(`/api/vehicles?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setVehicles(data.vehicles || [])
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const fetchSubscription = async (userId: string) => {
    try {
      const accessToken = localStorage.getItem('supabase.auth.token')
      const response = await fetch(`/api/subscriptions?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        // Also fetch addons for this subscription
        const addonsResponse = await fetch(`/api/subscriptions/${data.subscription.id}/addons`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        const addonsData = await addonsResponse.json()
        
        setSubscription({
          ...data.subscription,
          addons: addonsData.success ? addonsData.addons : []
        })
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const addVehicle = async () => {
    if (!user || !newVehicle.registration.trim()) return

    // Check vehicle limits based on subscription and user type
    const vehicleLimit = user.isPartner ? 5 : (subscription?.plan_type === 'PREMIUM' ? 3 : 1)
    if (vehicles.length >= vehicleLimit) {
      if (user.isPartner) {
        alert(`You can only add ${vehicleLimit} vehicles on your current plan. Purchase additional vehicles for £4.99 each.`)
      } else if (subscription?.plan_type === 'PREMIUM') {
        alert(`You can only add ${vehicleLimit} vehicles on your current plan. Purchase additional vehicles for £9.99 each.`)
      } else {
        alert(`You can only add ${vehicleLimit} vehicle${vehicleLimit > 1 ? 's' : ''} on your current plan. Upgrade to Premium for up to 3 vehicles.`)
      }
      return
    }

    try {
      const accessToken = localStorage.getItem('supabase.auth.token')
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          userId: user.id,
          registration: newVehicle.registration.toUpperCase(),
          make: newVehicle.make,
          model: newVehicle.model,
          year: newVehicle.year,
          motDueDate: newVehicle.motDueDate,
          taxDueDate: newVehicle.taxDueDate,
          insuranceDueDate: newVehicle.insuranceDueDate
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setNewVehicle({ registration: '', make: '', model: '', year: '', motDueDate: '', taxDueDate: '', insuranceDueDate: '' })
        setShowAddVehicle(false)
        fetchVehicles(user.id)
      } else {
        alert(data.error || 'Failed to add vehicle')
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Failed to add vehicle')
    }
  }

  const deleteVehicle = async (vehicleId: number) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const accessToken = localStorage.getItem('supabase.auth.token')
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        fetchVehicles(user!.id)
      } else {
        alert(data.error || 'Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Failed to delete vehicle')
    }
  }

  const handleAutoRenewalToggle = async (addonId: number, autoRenew: boolean) => {
    try {
      const accessToken = localStorage.getItem('supabase.auth.token')
      const response = await fetch('/api/stripe/additional-vehicle', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          addonId,
          autoRenew
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        // Refresh subscription data
        if (user) {
          fetchSubscription(user.id)
        }
      } else {
        alert(data.error || 'Failed to update auto-renewal setting')
      }
    } catch (error) {
      console.error('Error updating auto-renewal:', error)
      alert('Failed to update auto-renewal setting')
    }
  }

  const handleCancelSubscription = async (subscriptionId: number, cancelType: 'subscription' | 'addon', addonId?: number) => {
    if (!confirm(`Are you sure you want to cancel this ${cancelType}?`)) return

    try {
      const accessToken = localStorage.getItem('supabase.auth.token')
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          subscriptionId,
          addonId,
          cancelType
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        // Refresh subscription data
        if (user) {
          fetchSubscription(user.id)
        }
      } else {
        alert(data.error || 'Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Failed to cancel subscription')
    }
  }

  const getStatusColor = (daysUntilDue: number) => {
    if (daysUntilDue <= 7) return 'text-red-600 bg-red-100 border-red-200'
    if (daysUntilDue <= 30) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
    return 'text-green-600 bg-green-100 border-green-200'
  }

  const getStatusText = (daysUntilDue: number) => {
    if (daysUntilDue <= 7) return 'Due Soon'
    if (daysUntilDue <= 30) return 'Due This Month'
    return 'Upcoming'
  }

  const calculateDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getMostUrgentExpiry = (vehicle: Vehicle) => {
    const expiries = []
    
    if (vehicle.mot_due_date) {
      expiries.push({
        type: 'MOT',
        date: vehicle.mot_due_date,
        days: calculateDaysUntilDue(vehicle.mot_due_date)
      })
    }
    
    if (vehicle.tax_due_date) {
      expiries.push({
        type: 'Tax',
        date: vehicle.tax_due_date,
        days: calculateDaysUntilDue(vehicle.tax_due_date)
      })
    }
    
    if (vehicle.insurance_due_date) {
      expiries.push({
        type: 'Insurance',
        date: vehicle.insurance_due_date,
        days: calculateDaysUntilDue(vehicle.insurance_due_date)
      })
    }
    
    return expiries.sort((a, b) => a.days - b.days)[0] || null
  }

  const getPlanFeatures = () => {
    if (user?.isPartner) {
      return [
        'SMS + Email reminders',
        'Up to 5 vehicles included',
        'White-label branding',
        'Priority support',
        'No ads'
      ]
    } else if (user?.isPremium || subscription?.plan_type === 'PREMIUM') {
      return [
        'SMS + Email reminders',
        'Up to 3 vehicles',
        'Priority support',
        'No ads'
      ]
    }
    return [
      'Email reminders only',
      '1 vehicle limit',
      'Basic support',
      'Partner garage ads'
    ]
  }

  const getVehicleLimit = () => {
    if (user?.isPartner) return 5
    if (user?.isPremium || subscription?.plan_type === 'PREMIUM') return 3
    return 1
  }

  const getAdditionalVehiclePrice = () => {
    if (user?.isPartner) return '£4.99'
    return '£9.99'
  }

  const showUpgradeButton = () => {
    if (user?.isPartner) return false // Partners don't need to upgrade
    if (user?.isPremium || subscription?.plan_type === 'PREMIUM') return false // Premium users don't need to upgrade
    return true // Free users can upgrade to Premium
  }

  const showAddVehicleButton = () => {
    if (user?.isPartner) return true // Partners can always add vehicles
    if (user?.isPremium || subscription?.plan_type === 'PREMIUM') return true // Premium users can always add vehicles
    return vehicles.length < 1 // Free users can add 1 vehicle
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/mot-alert-logo.png"
                alt="MOT Alert Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-sm"
              />
              <span className="text-xl font-bold text-gray-900">MOT Alert</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/subscription" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/settings" className="text-gray-600 hover:text-gray-900 transition-colors">
                Settings
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>
                </div>
              </div>
            </nav>
            <MobileNav isLoggedIn={true} userName={user.name} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your vehicles and reminder preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Subscription Status</h2>
                <div className="flex space-x-2">
                  <Link href="/subscription" className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors">
                    Manage Plan
                  </Link>
                  {subscription?.status === 'active' && (
                    <button 
                      onClick={() => handleCancelSubscription(subscription.id, 'subscription')}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 rounded-full p-2">
                    <CreditCardIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {subscription?.plan_type === 'PREMIUM' ? 'Premium Plan' : 'Free Plan'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {subscription?.status === 'active' ? 'Active' : 'Inactive'}
                      {subscription?.current_period_end && ` • Renews ${new Date(subscription.current_period_end).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    subscription?.status === 'active' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {subscription?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Plan Features */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Your Plan Includes:</h3>
                <ul className="space-y-1">
                  {getPlanFeatures().map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Vehicle Addons */}
              {subscription?.addons && subscription.addons.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Vehicles:</h3>
                  <div className="space-y-2">
                    {subscription.addons.map((addon: any) => (
                      <div key={addon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {addon.quantity} additional vehicle{addon.quantity > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-600">
                            Expires: {new Date(addon.expires_at).toLocaleDateString()}
                            {addon.auto_renew && ' • Auto-renewal enabled'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAutoRenewalToggle(addon.id, !addon.auto_renew)}
                            className={`text-xs px-2 py-1 rounded border transition-colors ${
                              addon.auto_renew 
                                ? 'bg-green-100 text-green-700 border-green-300' 
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            {addon.auto_renew ? 'Auto-renewal ON' : 'Auto-renewal OFF'}
                          </button>
                          <button
                            onClick={() => handleCancelSubscription(subscription.id, 'addon', addon.id)}
                            className="text-xs px-2 py-1 rounded border bg-red-100 text-red-700 border-red-300 hover:bg-red-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vehicles */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Vehicles</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddVehicle(true)}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
              
              {vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles yet</h3>
                  <p className="text-gray-600 mb-6">Add your first vehicle to start receiving MOT reminders.</p>
                  <button 
                    onClick={() => setShowAddVehicle(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Add First Vehicle
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {vehicles.map((vehicle) => {
                    const mostUrgentExpiry = getMostUrgentExpiry(vehicle)
                    
                    return (
                      <div key={vehicle.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <TruckIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">{vehicle.registration}</p>
                              <p className="text-sm text-gray-600">
                                {vehicle.make} {vehicle.model} {vehicle.year}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {mostUrgentExpiry && (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(mostUrgentExpiry.days)}`}>
                                {mostUrgentExpiry.type} Due: {new Date(mostUrgentExpiry.date).toLocaleDateString()} ({mostUrgentExpiry.days} days)
                              </span>
                            )}
                            <button
                              onClick={() => deleteVehicle(vehicle.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete vehicle"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {vehicle.mot_due_date && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">MOT Due Date:</span>
                            <div className="flex items-center space-x-2">
                              <BellIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {new Date(vehicle.mot_due_date).toLocaleDateString()}
                                {mostUrgentExpiry?.type === 'MOT' && mostUrgentExpiry.days !== null && ` (${mostUrgentExpiry.days} days)`}
                              </span>
                            </div>
                          </div>
                        )}
                        {vehicle.tax_due_date && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Tax Due Date:</span>
                            <div className="flex items-center space-x-2">
                              <BellIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {new Date(vehicle.tax_due_date).toLocaleDateString()}
                                {mostUrgentExpiry?.type === 'Tax' && mostUrgentExpiry.days !== null && ` (${mostUrgentExpiry.days} days)`}
                              </span>
                            </div>
                          </div>
                        )}
                        {vehicle.insurance_due_date && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Insurance Due Date:</span>
                            <div className="flex items-center space-x-2">
                              <BellIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {new Date(vehicle.insurance_due_date).toLocaleDateString()}
                                {mostUrgentExpiry?.type === 'Insurance' && mostUrgentExpiry.days !== null && ` (${mostUrgentExpiry.days} days)`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Add Vehicle Modal */}
            {showAddVehicle && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Add Vehicle</h3>
                    <button
                      onClick={() => setShowAddVehicle(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Registration
                      </label>
                      <input
                        type="text"
                        value={newVehicle.registration}
                        onChange={(e) => setNewVehicle({ ...newVehicle, registration: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors font-mono text-lg"
                        placeholder="AB12 CDE"
                      />
                    </div>
                    
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Make
                         </label>
                         <input
                           type="text"
                           value={newVehicle.make}
                           onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Model
                         </label>
                         <input
                           type="text"
                           value={newVehicle.model}
                           onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Year
                         </label>
                         <input
                           type="text"
                           value={newVehicle.year}
                           onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                         />
                       </div>
                       {(user?.isPartner || user?.isPremium || subscription?.plan_type === 'PREMIUM') && (
                         <>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">
                               MOT Due Date
                             </label>
                             <input
                               type="date"
                               value={newVehicle.motDueDate}
                               onChange={(e) => setNewVehicle({ ...newVehicle, motDueDate: e.target.value })}
                               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                             />
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">
                               Tax Due Date
                             </label>
                             <input
                               type="date"
                               value={newVehicle.taxDueDate}
                               onChange={(e) => setNewVehicle({ ...newVehicle, taxDueDate: e.target.value })}
                               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                             />
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">
                               Insurance Due Date
                             </label>
                             <input
                               type="date"
                               value={newVehicle.insuranceDueDate}
                               onChange={(e) => setNewVehicle({ ...newVehicle, insuranceDueDate: e.target.value })}
                               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                             />
                           </div>
                         </>
                       )}
                       {!(user?.isPartner || user?.isPremium || subscription?.plan_type === 'PREMIUM') && (
                         <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                           💡 <strong>Free Plan:</strong> You can only track MOT due dates. Upgrade to Premium to track tax and insurance due dates as well.
                         </div>
                       )}
                     </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowAddVehicle(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addVehicle}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                      >
                        Add Vehicle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {showAddVehicleButton() && (
                  <button 
                    onClick={() => setShowAddVehicle(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </button>
                )}
                {vehicles.length >= getVehicleLimit() && (
                  <button 
                    onClick={() => {
                      const price = getAdditionalVehiclePrice()
                      alert(`Purchase additional vehicles for ${price} each. This feature is coming soon!`)
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <CreditCardIcon className="w-4 h-4 mr-2" />
                    Add Vehicle for {getAdditionalVehiclePrice()}
                  </button>
                )}
                {showUpgradeButton() && (
                  <Link 
                    href="/subscription" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <CreditCardIcon className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Link>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{user.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-400">📧</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">📱</span>
                    <span className="text-gray-600">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  {user.isVerified ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-gray-600">
                    {user.isVerified ? 'Email verified' : 'Email not verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Limits */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Limits</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vehicles:</span>
                  <span className="font-medium">
                    {vehicles.length} / {getVehicleLimit()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reminders:</span>
                  <span className="font-medium">
                    {user?.isPartner || subscription?.plan_type === 'PREMIUM' ? 'SMS + Email' : 'Email only'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Support:</span>
                  <span className="font-medium">
                    {user?.isPartner || subscription?.plan_type === 'PREMIUM' ? 'Priority' : 'Basic'}
                  </span>
                </div>
                {vehicles.length >= getVehicleLimit() && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Additional vehicles:</span>
                    <span className="font-medium text-blue-600">
                      {getAdditionalVehiclePrice()} each
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 