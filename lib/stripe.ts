import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const garagePlans = {
  GARAGE_STARTER: {
    id: 'price_garage_starter',
    name: 'Starter',
    price: 1500, // £15.00 in pence
    reminders: 100,
    features: ['100 reminders per month', 'Basic SMS & Email', 'Standard support']
  },
  GARAGE_PRO: {
    id: 'price_garage_pro',
    name: 'Pro',
    price: 4500, // £45.00 in pence
    reminders: 500,
    features: ['500 reminders per month', 'Priority SMS & Email', 'Priority support', 'Custom branding']
  },
  GARAGE_PREMIUM: {
    id: 'price_garage_premium',
    name: 'Premium',
    price: 9900, // £99.00 in pence
    reminders: null, // Unlimited
    features: ['Unlimited reminders', 'Priority SMS & Email', '24/7 support', 'Custom branding', 'API access']
  }
} as const

export const driverPlans = {
  DRIVER_PREMIUM_MONTHLY: {
    id: process.env.STRIPE_DRIVER_PREMIUM_MONTHLY || 'price_driver_premium_monthly',
    name: 'Premium Monthly',
    price: 199, // £1.99 in pence
    interval: 'month' as const,
    features: ['SMS & Email reminders', 'Up to 3 vehicles', 'Ad-free', 'Custom schedules', 'Priority support']
  },
  DRIVER_PREMIUM_ANNUAL: {
    id: process.env.STRIPE_DRIVER_PREMIUM_ANNUAL || 'price_driver_premium_annual',
    name: 'Premium Annual',
    price: 1999, // £19.99 in pence
    interval: 'year' as const,
    features: ['SMS & Email reminders', 'Up to 3 vehicles', 'Ad-free', 'Custom schedules', 'Priority support', '16% savings']
  }
} as const

export async function createGarageCheckoutSession(userId: string, planId: string) {
  try {
    const plan = Object.values(garagePlans).find((p: any) => p.id === planId)
    if (!plan) {
      throw new Error('Invalid garage plan')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${plan.name} Plan`,
              description: `${plan.reminders === null ? 'Unlimited' : plan.reminders} reminders per month`,
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/garage/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/garage/pricing?canceled=true`,
      metadata: {
        userId,
        planId,
        userType: 'garage',
      },
    })

    return session
  } catch (error) {
    console.error('Stripe garage checkout error:', error)
    throw error
  }
}

export async function createDriverCheckoutSession(userId: string, planId: string) {
  try {
    const plan = Object.values(driverPlans).find((p: any) => p.id === planId)
    if (!plan) {
      throw new Error('Invalid driver plan')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Premium Plan`,
              description: plan.interval === 'year' ? 'Annual Premium Plan (16% savings)' : 'Monthly Premium Plan',
            },
            unit_amount: plan.price,
            recurring: {
              interval: plan.interval as 'month' | 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
      metadata: {
        userId,
        planId,
        userType: 'driver',
      },
    })

    return session
  } catch (error) {
    console.error('Stripe driver checkout error:', error)
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/garage/dashboard`,
    })

    return session
  } catch (error) {
    console.error('Stripe portal error:', error)
    throw error
  }
}

export async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      await handleSubscriptionCreated(session)
      break

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice
      await handlePaymentSucceeded(invoice)
      break

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice
      await handlePaymentFailed(failedInvoice)
      break

    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionDeleted(subscription)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}

async function handleSubscriptionCreated(session: Stripe.Checkout.Session) {
  const { prisma } = await import('./prisma')
  
  const userId = session.metadata?.userId
  const planId = session.metadata?.planId
  const userType = session.metadata?.userType

  if (!userId || !planId || !userType) {
    console.error('Missing metadata in checkout session')
    return
  }

  let plan: any
  if (userType === 'garage') {
    plan = Object.values(garagePlans).find((p: any) => p.id === planId)
  } else {
    plan = Object.values(driverPlans).find((p: any) => p.id === planId)
  }

  if (!plan) {
    console.error('Invalid plan ID')
    return
  }

  // Determine the plan type for the database
  let planType: string
  if (userType === 'driver') {
    planType = planId.includes('annual') ? 'DRIVER_PREMIUM' : 'DRIVER_PREMIUM'
  } else {
    planType = planId.replace('price_garage_', '').toUpperCase()
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      plan: planType as any,
      reminderLimit: plan.reminders,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }
  })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const { prisma } = await import('./prisma')
  
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription as string }
  })

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
        usageCount: 0, // Reset usage count
        currentPeriodStart: new Date(invoice.period_start * 1000),
        currentPeriodEnd: new Date(invoice.period_end * 1000),
      }
    })
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const { prisma } = await import('./prisma')
  
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription as string }
  })

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'PAST_DUE',
      }
    })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { prisma } = await import('./prisma')
  
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  })

  if (dbSubscription) {
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: 'CANCELED',
      }
    })
  }
} 