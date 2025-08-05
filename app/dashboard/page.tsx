'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  UserIcon, 
  TruckIcon, 
  BellIcon,
  CreditCardIcon,
  PlusIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

// Mock data - in real app this would come from API
const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  plan: "Free",
  vehicles: [
    {
      registration: "AB12 CDE",
      make: "Ford",
      model: "Focus",
      motDueDate: "2024-12-15",
      daysUntilDue: 45,
      status: "upcoming"
    }
  ],
  recentActivity: [
    { type: "account_created", message: "Account created", time: "2 days ago", icon: "success" },
    { type: "vehicle_added", message: "Vehicle AB12 CDE added", time: "2 days ago", icon: "info" },
    { type: "reminder_scheduled", message: "MOT reminder scheduled", time: "2 days ago", icon: "warning" }
  ]
}

export default function DashboardPage() {
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [showAddVehicle, setShowAddVehicle] = useState(false)

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case 'info':
        return <TruckIcon className="w-4 h-4 text-blue-500" />
      case 'warning':
        return <BellIcon className="w-4 h-4 text-yellow-500" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
    }
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
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/subscription" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">{mockUserData.name}</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {mockUserData.name}! 👋
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
                <Link href="/subscription" className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors">
                  Manage Plan
                </Link>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 rounded-full p-2">
                    <CreditCardIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{mockUserData.plan} Plan</p>
                    <p className="text-sm text-gray-600">
                      {mockUserData.plan === 'Free' 
                        ? 'Email reminders for 1 vehicle' 
                        : 'SMS + Email reminders for up to 3 vehicles'
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicles */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Vehicles</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your vehicle reminders</p>
                </div>
                <button 
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors opacity-50 cursor-not-allowed"
                  disabled
                  title="Coming soon - Backend integration required"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {mockUserData.vehicles.map((vehicle, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <TruckIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{vehicle.registration}</p>
                          <p className="text-sm text-gray-600">
                            {vehicle.make} {vehicle.model}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(vehicle.daysUntilDue)}`}>
                        {getStatusText(vehicle.daysUntilDue)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {vehicle.daysUntilDue} days until MOT due
                      </span>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Reminders active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reminder Preferences */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Reminder Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <BellIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email Reminders</p>
                      <p className="text-sm text-gray-600">Receive reminders via email</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl opacity-60">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 rounded-full p-2">
                      <BellIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">SMS Reminders</p>
                      <p className="text-sm text-gray-600">Receive reminders via SMS</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={smsEnabled}
                      onChange={(e) => setSmsEnabled(e.target.checked)}
                      disabled
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
                  <p className="text-sm text-orange-800">
                    <strong>Upgrade to Premium</strong> to enable SMS reminders and manage up to 3 vehicles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                  title="Coming soon - Backend integration required"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Vehicle
                </button>
                <Link 
                  href="/subscription" 
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {mockUserData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    {getActivityIcon(activity.icon)}
                    <span className="text-gray-600 flex-1">{activity.message}</span>
                    <span className="text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <Link href="#faq" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  FAQ
                </Link>
                <Link href="/contact" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Contact Support
                </Link>
                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/settings" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Account Settings
                </Link>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Security Status</h3>
                  <p className="text-sm text-gray-600">Your account is secure</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Email verified</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Strong password</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">2FA available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 