import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Car Owner',
    content: 'MOT Alert saved me from a £1,000 fine! I completely forgot about my MOT and got a reminder just in time. The service is brilliant and completely free.',
    rating: 5,
    avatar: '/avatars/sarah.jpg'
  },
  {
    name: 'Mike Thompson',
    role: 'Garage Owner',
    content: 'We\'ve been using MOT Alert for our garage for 6 months now. Our customer retention has increased by 40% and we\'re getting more bookings than ever.',
    rating: 5,
    avatar: '/avatars/mike.jpg'
  },
  {
    name: 'Emma Davis',
    role: 'Fleet Manager',
    content: 'Managing 50+ company vehicles was a nightmare until we found MOT Alert. Now all our MOTs are tracked automatically and we never miss a deadline.',
    rating: 5,
    avatar: '/avatars/emma.jpg'
  },
  {
    name: 'David Wilson',
    role: 'Motorcycle Owner',
    content: 'Simple, reliable, and free. What more could you ask for? The SMS reminders are perfect for busy people like me.',
    rating: 5,
    avatar: '/avatars/david.jpg'
  },
  {
    name: 'Lisa Chen',
    role: 'Van Driver',
    content: 'I run a delivery business and MOT Alert helps me keep all my vans on the road legally. The email reminders are great for record keeping.',
    rating: 5,
    avatar: '/avatars/lisa.jpg'
  },
  {
    name: 'James Brown',
    role: 'Garage Manager',
    content: 'The white-label feature is fantastic. Our customers think we\'re sending the reminders directly, which builds trust and loyalty.',
    rating: 5,
    avatar: '/avatars/james.jpg'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-display mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied drivers and garages who trust MOT Alert
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-200" />
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50,000+</div>
              <div className="text-gray-600">Active users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Average rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to never miss your MOT again?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              Get Free Reminders
            </a>
            <a
              href="/garage"
              className="inline-flex items-center justify-center px-8 py-3 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
            >
              For Garages
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 