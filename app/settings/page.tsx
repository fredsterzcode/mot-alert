'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  BellIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  isVerified: boolean
  isPremium: boolean
  isPartner: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    motReminders: true,
    taxReminders: true,
    insuranceReminders: true,
    reminderFrequency: '7,3,1' // days before due
  })

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
        setFormData({
          name: userData.user.name || '',
          email: userData.user.email || '',
          phone: userData.user.phone || ''
        })
      } else {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Profile updated successfully!')
      } else {
        alert(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/users/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationPrefs)
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Notification preferences updated successfully!')
      } else {
        alert(data.error || 'Failed to update notification preferences')
      }
    } catch (error) {
      console.error('Error updating notifications:', error)
      alert('Failed to update notification preferences')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
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
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <Image
                src="/mot-alert-logo.png"
                alt="MOT Alert Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-gray-900">Settings</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your contact information and notification preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                    <p className="text-gray-600 mb-6">Update your contact details to receive MOT alerts</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            placeholder="Enter your email address"
                          />
                          {user.isVerified ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number {user.isPremium || user.isPartner ? '*' : '(Premium/Partner only)'}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                          placeholder="+44 7123 456789"
                          disabled={!user.isPremium && !user.isPartner}
                        />
                        {!user.isPremium && !user.isPartner && (
                          <p className="text-sm text-gray-500 mt-1">
                            Upgrade to Premium or Partner to receive SMS alerts
                          </p>
                        )}
                      </div>

                      <button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                    <p className="text-gray-600 mb-6">Choose how you want to receive MOT alerts</p>
                    
                    <div className="space-y-6">
                      {/* Notification Methods */}
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Notification Methods</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">Email Notifications</p>
                                <p className="text-sm text-gray-600">Receive alerts via email</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setNotificationPrefs({ ...notificationPrefs, emailNotifications: !notificationPrefs.emailNotifications })}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                notificationPrefs.emailNotifications
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              {notificationPrefs.emailNotifications ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <PhoneIcon className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-900">SMS Notifications</p>
                                <p className="text-sm text-gray-600">Receive alerts via SMS</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setNotificationPrefs({ ...notificationPrefs, smsNotifications: !notificationPrefs.smsNotifications })}
                              disabled={!user.isPremium && !user.isPartner}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                notificationPrefs.smsNotifications
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                              } ${(!user.isPremium && !user.isPartner) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {notificationPrefs.smsNotifications ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>
                          {!user.isPremium && !user.isPartner && (
                            <p className="text-sm text-gray-500">
                              Upgrade to Premium or Partner to enable SMS notifications
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Alert Types */}
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Alert Types</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">MOT Reminders</p>
                              <p className="text-sm text-gray-600">Get notified when MOT is due</p>
                            </div>
                            <button
                              onClick={() => setNotificationPrefs({ ...notificationPrefs, motReminders: !notificationPrefs.motReminders })}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                notificationPrefs.motReminders
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              {notificationPrefs.motReminders ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Tax Reminders</p>
                              <p className="text-sm text-gray-600">Get notified when road tax is due</p>
                            </div>
                            <button
                              onClick={() => setNotificationPrefs({ ...notificationPrefs, taxReminders: !notificationPrefs.taxReminders })}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                notificationPrefs.taxReminders
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              {notificationPrefs.taxReminders ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Insurance Reminders</p>
                              <p className="text-sm text-gray-600">Get notified when insurance is due</p>
                            </div>
                            <button
                              onClick={() => setNotificationPrefs({ ...notificationPrefs, insuranceReminders: !notificationPrefs.insuranceReminders })}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                notificationPrefs.insuranceReminders
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              {notificationPrefs.insuranceReminders ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Reminder Frequency */}
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Reminder Frequency</h3>
                        <p className="text-sm text-gray-600 mb-4">Choose when to receive reminders before due dates</p>
                        <select
                          value={notificationPrefs.reminderFrequency}
                          onChange={(e) => setNotificationPrefs({ ...notificationPrefs, reminderFrequency: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="7,3,1">7, 3, and 1 day before</option>
                          <option value="14,7,3,1">14, 7, 3, and 1 day before</option>
                          <option value="30,14,7,3,1">30, 14, 7, 3, and 1 day before</option>
                          <option value="7,1">7 and 1 day before</option>
                          <option value="3,1">3 and 1 day before</option>
                        </select>
                      </div>

                      <button 
                        onClick={handleSaveNotifications}
                        disabled={saving}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        {saving ? 'Saving...' : 'Save Notification Preferences'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-green-100 rounded-full p-2">
                              <CheckIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Email Verification</h3>
                              <p className="text-sm text-gray-600">Your email is verified</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 rounded-full p-2">
                              <LockClosedIcon className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                              <p className="text-sm text-gray-600">Add an extra layer of security</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                            Enable
                          </button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <LockClosedIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Change Password</h3>
                              <p className="text-sm text-gray-600">Update your password regularly</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                            Change
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Preferences</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 rounded-full p-2">
                              <Cog6ToothIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Account Type</h3>
                              <p className="text-sm text-gray-600">
                                {user.isPartner ? 'Partner Account' : user.isPremium ? 'Premium Account' : 'Free Account'}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.isPartner 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : user.isPremium 
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {user.isPartner ? 'Partner' : user.isPremium ? 'Premium' : 'Free'}
                          </span>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 rounded-full p-2">
                              <BellIcon className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Marketing Communications</h3>
                              <p className="text-sm text-gray-600">Receive updates about new features</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                            Disabled
                          </button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-red-100 rounded-full p-2">
                              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Delete Account</h3>
                              <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-red-100 text-red-700 border border-red-200 rounded-lg font-medium hover:bg-red-200 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}