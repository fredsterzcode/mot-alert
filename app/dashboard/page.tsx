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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

// Mock data - in real app this would come from API
const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  plan: "Free",
  vehicles: [
    {
      registration: "AB12 CDE",
      motDueDate: "2026-03-15",
      daysUntilDue: 45,
      status: "upcoming"
    }
  ]
}

export default function DashboardPage() {
  const [smsEnabled, setSmsEnabled] = useState(false)

  const getStatusColor = (daysUntilDue: number) => {
    if (daysUntilDue <= 7) return 'text-red-600 bg-red-100'
    if (daysUntilDue <= 30) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getStatusText = (daysUntilDue: number) => {
    if (daysUntilDue <= 7) return 'Due Soon'
    if (daysUntilDue <= 30) return 'Due This Month'
    return 'Upcoming'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/mot-alert-logo.png"
                alt="MOT Alert Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-gray-900">MOT Alert</span>
            </div>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/subscription" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">{mockUserData.name}</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {mockUserData.name}!
          </h1>
          <p className="text-gray-600">
            Manage your vehicles and reminder preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Status */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Subscription Status</h2>
                <Link href="/subscription" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Manage Plan
                </Link>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCardIcon className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{mockUserData.plan} Plan</p>
                    <p className="text-sm text-gray-600">
                      {mockUserData.plan === 'Free' 
                        ? 'Email reminders for 1 vehicle' 
                        : 'SMS + Email reminders for up to 3 vehicles'
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicles */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Vehicles</h2>
                <button 
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium opacity-50 cursor-not-allowed"
                  disabled
                  title="Coming soon - Backend integration required"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {mockUserData.vehicles.map((vehicle, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <TruckIcon className="w-6 h-6 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">{vehicle.registration}</p>
                          <p className="text-sm text-gray-600">
                            MOT due: {vehicle.motDueDate}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.daysUntilDue)}`}>
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
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reminder Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Reminders</p>
                      <p className="text-sm text-gray-600">Receive reminders via email</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Reminders</p>
                      <p className="text-sm text-gray-600">Receive reminders via SMS</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={smsEnabled}
                      onChange={(e) => setSmsEnabled(e.target.checked)}
                      disabled
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Upgrade to Premium</strong> to enable SMS reminders and manage up to 3 vehicles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  className="w-full btn-primary flex items-center justify-center"
                  disabled
                  title="Coming soon - Backend integration required"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Vehicle
                </button>
                <Link 
                  href="/subscription" 
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Account created</span>
                  <span className="text-gray-400">2 days ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Vehicle added</span>
                  <span className="text-gray-400">2 days ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Reminder scheduled</span>
                  <span className="text-gray-400">2 days ago</span>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <Link href="#faq" className="block text-sm text-gray-600 hover:text-primary-600">
                  FAQ
                </Link>
                <Link href="/contact" className="block text-sm text-gray-600 hover:text-primary-600">
                  Contact Support
                </Link>
                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-primary-600">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 