import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
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
              <span className="text-xl font-bold text-gray-900">MOT Alert</span>
            </Link>
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-GB')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using MOT Alert ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                MOT Alert provides MOT and tax reminder services through SMS and email notifications. Our service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Free tier: Email reminders for 1 vehicle</li>
                <li>Premium tier: SMS and email reminders for up to 3 vehicles</li>
                <li>White-label tier: Business solutions for garages</li>
                <li>Vehicle management and reminder scheduling</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Subscription and Billing</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Subscription Plans</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Free Plan:</strong> £0/month - Email reminders for 1 vehicle</li>
                <li><strong>Premium Plan:</strong> £2.99/month - SMS and email reminders for up to 3 vehicles</li>
                <li><strong>White-Label Plan:</strong> £49.99/month - Business solution with 100 vehicles included</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Billing Cycle</h3>
              <p className="text-gray-700 mb-4">
                Subscriptions are billed monthly in advance. Payment is processed securely through Stripe. You will be charged on the same date each month until you cancel.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Subscription Cancellation Policy</h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-800 font-semibold mb-2">Important: How Cancellation Works</p>
                <ul className="list-disc pl-6 text-orange-700 text-sm">
                  <li><strong>When you cancel:</strong> Your subscription is marked for cancellation at the end of your current billing period</li>
                  <li><strong>During billing period:</strong> You retain full premium access until your period ends</li>
                  <li><strong>After period ends:</strong> You are automatically downgraded to free tier</li>
                  <li><strong>Reminders during period:</strong> All scheduled reminders will be sent as normal</li>
                  <li><strong>Reminders after period:</strong> SMS reminders stop, email reminders continue (free feature)</li>
                </ul>
              </div>
              <p className="text-gray-700 mb-4">
                You may cancel your subscription at any time through your dashboard. Cancellation takes effect at the end of your current billing period. No refunds are provided for partial months.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate vehicle and contact information</li>
                <li>Maintain valid payment methods for paid subscriptions</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not attempt to circumvent any service limitations</li>
                <li>Keep your account credentials secure</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Service Limitations</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Free users: 1 vehicle, email reminders only</li>
                <li>Premium users: 3 vehicles, SMS and email reminders</li>
                <li>White-label users: 100 vehicles included, additional vehicles at £2.99 each</li>
                <li>Service availability may vary due to maintenance or technical issues</li>
                <li>We are not responsible for missed MOT or tax deadlines</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data and Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of MOT Alert and its licensors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall MOT Alert, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> info@facsystems.co.uk<br />
                  <strong>Phone:</strong> +0333 322 0408<br />
                  <strong>Address:</strong> [Your Business Address]
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
