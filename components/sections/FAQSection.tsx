'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'What is an MOT test?',
    answer: 'An MOT (Ministry of Transport) test is an annual safety and emissions test required for most vehicles over 3 years old in the UK. It checks that your vehicle meets road safety and environmental standards.'
  },
  {
    question: 'When is my MOT due?',
    answer: 'Your MOT is due on the anniversary of your last MOT test. For new vehicles, the first MOT is due when the vehicle is 3 years old. You can check your MOT due date on the DVLA website or use our reminder service.'
  },
  {
    question: 'How much does an MOT cost?',
    answer: 'The maximum fee for an MOT test is £54.85 for cars and motorcycles, but many garages offer competitive rates. The actual cost may vary depending on the garage and your location.'
  },
  {
    question: 'Can I drive without an MOT?',
    answer: 'No, it is illegal to drive a vehicle without a valid MOT certificate unless you are driving to a pre-booked MOT test. Driving without an MOT can result in fines and penalty points on your licence.'
  },
  {
    question: 'What happens if my car fails its MOT?',
    answer: 'If your car fails its MOT, you will receive a failure certificate listing the issues. You can have the repairs done at any garage and then return for a partial retest (free if done within 10 working days at the same garage).'
  },
  {
    question: 'How far in advance can I book an MOT?',
    answer: 'You can book an MOT up to 1 month before the due date. The certificate will be valid for 13 months from the test date, so you won\'t lose any time by testing early.'
  },
  {
    question: 'How much does MOT Alert cost for drivers?',
    answer: 'The Free tier offers email reminders for one vehicle with partner garage promotions. The Premium tier (£1.99/month or £19.99/year) includes SMS and email reminders for up to 3 vehicles, ad-free, with custom schedules and priority support.'
  },
  {
    question: 'What\'s the difference between Free and Premium tiers?',
    answer: 'Free includes email-only reminders for one vehicle with ads. Premium adds SMS reminders, supports up to 3 vehicles, and is ad-free with customizable schedules.'
  },
  {
    question: 'How do I upgrade to Premium?',
    answer: 'From your dashboard, click "Upgrade to Premium" and complete the secure Stripe Checkout process for monthly or annual billing. You can also visit the subscription page directly.'
  },
  {
    question: 'How do I cancel my reminders?',
    answer: 'You can cancel your reminders at any time by logging into your account and updating your preferences, or by clicking the unsubscribe link in any email we send you. Premium subscribers can also manage their subscription through the customer portal.'
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes, we use Stripe for all payment processing, which is PCI DSS compliant and trusted by millions of businesses worldwide. We never store your payment information on our servers.'
  },
  {
    question: 'Can I get a refund?',
    answer: 'We offer a 30-day money-back guarantee for Premium subscriptions. If you\'re not satisfied, contact our support team within 30 days of your first payment for a full refund.'
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-display mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about MOT tests and our reminder service
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@mot-alert.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Help Centre
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 