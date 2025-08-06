'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  UserGroupIcon, 
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
  ShieldCheckIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Partner {
  id: number
  name: string
  company_name: string
  logo_url?: string
  primary_color: string
  secondary_color: string
  contact_email: string
  phone?: string
  is_active: boolean
}

interface PartnerCustomer {
  id: number
  customer_email: string
  customer_name?: string
  customer_phone?: string
  registration: string
  make?: string
  model?: string
  year?: number
  mot_due_date?: string
  tax_due_date?: string
  insurance_due_date?: string
  is_active: boolean
  created_at: string
}

export default function PartnerDashboard() {
  const [partner, setPartner] = useState<Partner | null>(null)
  const [customers, setCustomers] = useState<PartnerCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, due-soon, due-month

  useEffect(() => {
    fetchPartnerData()
  }, [])

  const fetchPartnerData = async () => {
    try {
      const response = await fetch('/api/partners?includeStats=true')
      const data = await response.json()
      
      if (data.success && data.partner) {
        setPartner(data.partner)
        fetchCustomers()
      } else {
        // Not a partner, redirect to regular dashboard
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Error fetching partner data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/partners/customers')
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
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

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_phone?.includes(searchTerm)

    if (!matchesSearch) return false

    if (filterStatus === 'all') return true
    if (filterStatus === 'active') return customer.is_active
    if (filterStatus === 'due-soon') {
      if (!customer.mot_due_date) return false
      const days = calculateDaysUntilDue(customer.mot_due_date)
      return days <= 7 && days > 0
    }
    if (filterStatus === 'due-month') {
      if (!customer.mot_due_date) return false
      const days = calculateDaysUntilDue(customer.mot_due_date)
      return days <= 30 && days > 0
    }

    return true
  })

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`, '_blank')
  }

  const handleEmailCustomer = (email: string) => {
    window.open(`mailto:${email}`, '_blank')
  }

  const handleSmsCustomer = (phone: string) => {
    window.open(`sms:${phone}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading partner dashboard...</p>
        </div>
      </div>
    )
  }

  if (!partner) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              {partner.logo_url ? (
                <Image
                  src={partner.logo_url}
                  alt={`${partner.company_name} Logo`}
                  width={40}
                  height={40}
                  className="rounded-xl shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
                </div>
              )}
              <div>
                <span className="text-xl font-bold text-gray-900">{partner.company_name}</span>
                <div className="text-sm text-gray-500">Partner Dashboard</div>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/partner/settings" className="text-gray-600 hover:text-gray-900 transition-colors">
                Settings
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">{partner.name}</span>
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
            Welcome back, {partner.name}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your customers and MOT Alert service
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Partner Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Partner Status</h2>
                <Link href="/partner/settings" className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors">
                  Manage Settings
                </Link>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 rounded-full p-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{partner.company_name}</p>
                    <p className="text-sm text-gray-600">
                      {customers.length} customers • White-label MOT Alert
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

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search customers by name, email, phone, or registration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Customers</option>
                  <option value="active">Active Only</option>
                  <option value="due-soon">Due Soon (≤7 days)</option>
                  <option value="due-month">Due This Month (≤30 days)</option>
                </select>
              </div>
            </div>

            {/* Customers */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Customers</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredCustomers.length} of {customers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} shown
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddCustomer(true)}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Customer</span>
                </button>
              </div>
              
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {customers.length === 0 ? 'No customers yet' : 'No customers match your search'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {customers.length === 0 
                      ? 'Start by adding your first customer to provide MOT Alert services.'
                      : 'Try adjusting your search terms or filters.'
                    }
                  </p>
                  {customers.length === 0 && (
                    <button 
                      onClick={() => setShowAddCustomer(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Add First Customer
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCustomers.map((customer) => {
                    const motDaysUntilDue = customer.mot_due_date ? calculateDaysUntilDue(customer.mot_due_date) : null
                    const taxDaysUntilDue = customer.tax_due_date ? calculateDaysUntilDue(customer.tax_due_date) : null
                    const insuranceDaysUntilDue = customer.insurance_due_date ? calculateDaysUntilDue(customer.insurance_due_date) : null
                    
                    return (
                      <div key={customer.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <TruckIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">{customer.registration}</p>
                              <p className="text-sm text-gray-600 font-medium">
                                {customer.customer_name || 'No name provided'}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                {customer.customer_phone && (
                                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <PhoneIcon className="w-3 h-3" />
                                    <span>{customer.customer_phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <EnvelopeIcon className="w-3 h-3" />
                                  <span>{customer.customer_email}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {motDaysUntilDue !== null && (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(motDaysUntilDue)}`}>
                                {getStatusText(motDaysUntilDue)}
                              </span>
                            )}
                            <div className="flex items-center space-x-1">
                              {customer.customer_phone && (
                                <button
                                  onClick={() => handleCallCustomer(customer.customer_phone!)}
                                  className="p-1 text-green-600 hover:text-green-700 transition-colors"
                                  title="Call customer"
                                >
                                  <PhoneIcon className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleEmailCustomer(customer.customer_email)}
                                className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                                title="Email customer"
                              >
                                <EnvelopeIcon className="w-4 h-4" />
                              </button>
                              {customer.customer_phone && (
                                <button
                                  onClick={() => handleSmsCustomer(customer.customer_phone!)}
                                  className="p-1 text-purple-600 hover:text-purple-700 transition-colors"
                                  title="SMS customer"
                                >
                                  <BellIcon className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Vehicle</p>
                            <p className="font-medium">
                              {customer.make} {customer.model} {customer.year}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600 mb-1">MOT Due</p>
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {customer.mot_due_date 
                                  ? `${new Date(customer.mot_due_date).toLocaleDateString()} (${motDaysUntilDue} days)`
                                  : 'Not set'
                                }
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-gray-600 mb-1">Tax Due</p>
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {customer.tax_due_date 
                                  ? `${new Date(customer.tax_due_date).toLocaleDateString()} (${taxDaysUntilDue} days)`
                                  : 'Not set'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {customer.insurance_due_date && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-gray-600 text-sm mb-1">Insurance Due</p>
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-sm">
                                {new Date(customer.insurance_due_date).toLocaleDateString()} ({insuranceDaysUntilDue} days)
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

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {customers.filter(c => c.is_active).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Customers</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600">
                    {customers.filter(c => {
                      if (!c.mot_due_date) return false
                      const days = calculateDaysUntilDue(c.mot_due_date)
                      return days <= 30 && days > 0
                    }).length}
                  </div>
                  <div className="text-sm text-gray-600">Due This Month</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">
                    {customers.filter(c => {
                      if (!c.mot_due_date) return false
                      const days = calculateDaysUntilDue(c.mot_due_date)
                      return days <= 7 && days > 0
                    }).length}
                  </div>
                  <div className="text-sm text-gray-600">Due Soon</div>
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
                  onClick={() => setShowAddCustomer(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Customer
                </button>
                <Link 
                  href="/partner/settings" 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <Cog6ToothIcon className="w-4 h-4 mr-2" />
                  Partner Settings
                </Link>
                <Link 
                  href="/partner/billing" 
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  View Billing
                </Link>
              </div>
            </div>

            {/* Partner Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{partner.company_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{partner.contact_email}</span>
                </div>
                {partner.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{partner.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Active Partner</span>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <Link href="/partner/docs" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Partner Documentation
                </Link>
                <Link href="/partner/support" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Contact Support
                </Link>
                <Link href="/partner/api" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  API Documentation
                </Link>
                <Link href="/partner/settings" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
} 