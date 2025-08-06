'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline'

interface MobileNavProps {
  isLoggedIn?: boolean
  userName?: string
}

export default function MobileNav({ isLoggedIn = false, userName }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="text-gray-700 p-2 hover:text-orange-600 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={toggleMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/mot-alert-logo.png"
                    alt="MOT Alert Logo"
                    width={32}
                    height={32}
                    className="rounded-lg shadow-sm"
                  />
                  <div>
                    <div className="text-base font-bold text-gray-900">MOT Alert</div>
                    <div className="text-xs text-gray-500">Mot & Tax Reminder</div>
                  </div>
                </div>
                <button
                  onClick={toggleMenu}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 space-y-2">
                {isLoggedIn && userName && (
                  <div className="py-3 border-b border-gray-200 mb-4">
                    <div className="text-sm text-gray-500">Welcome back</div>
                    <div className="text-base font-semibold text-gray-900">{userName}</div>
                  </div>
                )}
                
                <Link 
                  href="/" 
                  className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
                <Link 
                  href="/subscription" 
                  className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                  onClick={toggleMenu}
                >
                  Pricing
                </Link>
                <Link 
                  href="#faq" 
                  className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                  onClick={toggleMenu}
                >
                  FAQ
                </Link>
                
                {isLoggedIn ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      Settings
                    </Link>
                    <Link 
                      href="/subscription" 
                      className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      Manage Subscription
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="block py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-semibold text-center mt-4"
                      onClick={toggleMenu}
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </nav>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Support</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">📧</span>
                    <a 
                      href="mailto:info@facsystems.co.uk" 
                      className="hover:text-orange-600 transition-colors"
                    >
                      info@facsystems.co.uk
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📱</span>
                    <a 
                      href="tel:+03333220408" 
                      className="hover:text-orange-600 transition-colors"
                    >
                      +0333 322 0408
                    </a>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Available Monday-Friday, 9AM-5PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 