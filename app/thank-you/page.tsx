'use client';

import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function ThankYouPage() {
  // Mock data as specified in the prompt
  const mockData = {
    name: "John Doe",
    registration: "AB12 CDE",
    motDueDate: "2026-03-15"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
        </div>

        {/* Confirmation Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to MOT Alert!
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Thanks for signing up, <span className="font-semibold text-orange-600">{mockData.name}</span>! 
          Your MOT & Tax reminder for <span className="font-mono font-semibold text-gray-800">{mockData.registration}</span> 
          is set for <span className="font-semibold text-gray-800">{mockData.motDueDate}</span>.
        </p>

        {/* Additional Info */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-800">
            <strong>What's next?</strong> You'll receive email reminders 1 month, 2 weeks, and 2 days before your MOT is due.
          </p>
        </div>

        {/* CTA Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Go to Dashboard
        </Link>

        {/* Upgrade Link */}
        <p className="text-sm text-gray-500 mt-4">
          Want SMS reminders and up to 3 vehicles?{' '}
          <Link href="/subscription" className="text-orange-600 hover:text-orange-700 font-medium">
            Upgrade to Premium
          </Link>
        </p>
      </div>
    </div>
  );
} 