'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Script from 'next/script';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How much does MOT Alert cost for drivers?",
    answer: "The Free tier offers email reminders for one vehicle with partner garage promotions. The Premium tier (£2.99/month) includes SMS and email reminders for up to 3 vehicles, ad-free, with custom schedules and priority support. Additional vehicles cost £9.99 each for Premium users."
  },
  {
    question: "What's the difference between Free and Premium tiers?",
    answer: "The Free tier provides email-only reminders for one vehicle with ads. The Premium tier adds SMS reminders, supports up to 3 vehicles, and is ad-free with customizable schedules. Additional vehicles can be purchased for £9.99 each."
  },
  {
    question: "How do I upgrade to Premium?",
    answer: "From your dashboard, click 'Upgrade to Premium' to subscribe via secure payment. Free users can only upgrade to Premium - there's no option to purchase individual vehicles."
  },
  {
    question: "How do the reminders work?",
    answer: "Free users receive email reminders 1 month, 2 weeks, and 2 days before their MOT is due. Premium users get both email and SMS reminders, plus can customize their reminder schedule."
  },
  {
    question: "Can I add multiple vehicles?",
    answer: "Free users can register 1 vehicle and must upgrade to Premium for more. Premium users can manage up to 3 vehicles with individual reminder schedules for each. Additional vehicles cost £9.99 each for Premium users."
  },
  {
    question: "What about garage partners?",
    answer: "Garage partners get the White-Label service for £49.99/month, which includes 100 vehicles free and £2.99 per additional vehicle. This includes custom branding and customer management tools."
  },
  {
    question: "How does subscription cancellation work?",
    answer: "When you cancel your subscription, you retain full premium access until the end of your current billing period. After that, you're automatically downgraded to the free tier. During your billing period, all scheduled reminders will be sent normally. After cancellation, SMS reminders stop but email reminders continue (free feature). No refunds are provided for partial months."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use industry-standard encryption and never share your personal information with third parties. Your vehicle registration and contact details are stored securely."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      {/* AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9467909403537446"
        crossOrigin="anonymous"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about MOT Alert's free and premium reminder services
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-orange-600 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                id={`faq-content-${index}`}
                className={`px-6 transition-all duration-200 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100 pb-4'
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              Contact Support
            </button>
            <button className="border border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 