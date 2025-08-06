import Image from 'next/image'
import Link from 'next/link'
import { 
  BellIcon, 
  CheckIcon, 
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import FAQ from '@/components/FAQ'
import MobileNav from '@/components/MobileNav'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/mot-alert-logo.png"
                alt="MOT Alert Logo"
                width={48}
                height={48}
                className="rounded-xl shadow-sm"
              />
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-gray-900">MOT Alert</div>
                <div className="text-xs text-gray-500">Mot & Tax Reminder</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/subscription" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="#faq" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                FAQ
              </Link>
              <Link href="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 font-semibold shadow-lg">
                Get Started Free
              </Link>
            </nav>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-50 via-white to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo Section */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-orange-100">
                <Image
                  src="/mot-alert-logo.png"
                  alt="MOT Alert Logo"
                  width={120}
                  height={120}
                  className="rounded-xl"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-orange-500 bg-clip-text text-transparent leading-tight">
              Never Miss Your MOT Again
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join <span className="font-semibold text-orange-600">50,000+ drivers</span> who trust MOT Alert for timely reminders. 
              Get started free today - no credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/signup"
                className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center"
              >
                Get Started Free
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center text-gray-700 hover:text-orange-600 font-medium">
                <PlayIcon className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Setup in 2 minutes
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-6">Trusted by drivers across the UK</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">⭐ 4.9/5 Trustpilot</div>
              <div className="text-2xl font-bold text-gray-400">📱 50K+ Users</div>
              <div className="text-2xl font-bold text-gray-400">🚗 75K+ Vehicles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more features. No hidden fees.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 lg:p-12 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TruckIcon className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  £0<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Email reminders for MOT</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>1 vehicle</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Partner garage ads</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Basic dashboard</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Setup in 2 minutes</span>
                </li>
              </ul>
              
              <Link 
                href="/signup"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center text-lg"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl p-8 lg:p-12 relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-white text-orange-600 px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                  <StarIcon className="w-4 h-4 mr-2" />
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BellIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium Plan</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  £19.99<span className="text-lg text-orange-100">/year</span>
                </div>
                <div className="text-sm text-orange-100 mb-2">
                  or £1.99/month
                </div>
                <p className="text-orange-100">For serious drivers</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-white">SMS + Email reminders</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-white">Up to 3 vehicles</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-white">Ad-free experience</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-white">Custom schedules</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-white">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-white">Tax & insurance reminders</span>
                </li>
              </ul>
              
              <button 
                className="w-full bg-white hover:bg-gray-100 text-orange-600 font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center text-lg shadow-lg"
                disabled
                title="Coming soon - Backend integration required"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Drivers Choose MOT Alert
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built by drivers, for drivers. We understand what you need to stay compliant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                <TruckIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Easy Setup</h3>
              <p className="text-gray-600 leading-relaxed">
                Get started in under 2 minutes. Just enter your vehicle registration and you're done.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                <BellIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reliable Reminders</h3>
              <p className="text-gray-600 leading-relaxed">
                Never miss your MOT with our proven reminder system. 99.9% of users never miss a deadline.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with bank-level security. We never share your information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied drivers across the UK
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">Verified Customer</span>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "MOT Alert saved me from a £1,000 fine! The reminders are spot on and I never miss my MOT now. Best £19.99 I spend each year."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  J
                </div>
                <div>
                  <div className="font-semibold text-gray-900">John Davies</div>
                  <div className="text-sm text-gray-500">London, UK</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">Verified Customer</span>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The Premium plan is worth every penny. SMS reminders ensure I never forget important dates. Setup was incredibly easy."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                  <div className="text-sm text-gray-500">Manchester, UK</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">Verified Customer</span>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Simple, reliable, and free to start. What more could you ask for? The customer support is excellent too."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Mike Roberts</div>
                  <div className="text-sm text-gray-500">Birmingham, UK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Never Miss Your MOT Again?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join 50,000+ drivers who trust MOT Alert. Get started free today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="bg-white hover:bg-gray-100 text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-xl flex items-center justify-center"
            >
              Get Started Free
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/subscription"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about MOT Alert
            </p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <Image
                  src="/mot-alert-logo.png"
                  alt="MOT Alert Logo"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
                <div>
                  <div className="text-xl font-bold">MOT Alert</div>
                  <div className="text-sm text-gray-400">Mot & Tax Reminder</div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Never miss your MOT again. Get timely reminders via SMS or email. 
                Trusted by 50,000+ drivers across the UK.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/subscription" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/signup" className="text-gray-300 hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <a href="mailto:info@facsystems.co.uk" className="text-gray-300 hover:text-white transition-colors">
                    info@facsystems.co.uk
                  </a>
                </li>
                <li className="flex items-center">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <a href="tel:+03333220408" className="text-gray-300 hover:text-white transition-colors">
                    +0333 322 0408
                  </a>
                </li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MOT Alert. All rights reserved. Made with ❤️ in the UK.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 