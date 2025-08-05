import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createDriverCheckoutSession, createGarageCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, userType } = await request.json()

    if (!planId || !userType) {
      return NextResponse.json({ error: 'Missing planId or userType' }, { status: 400 })
    }

    let checkoutSession
    if (userType === 'driver') {
      checkoutSession = await createDriverCheckoutSession(session.user.id, planId)
    } else if (userType === 'garage') {
      checkoutSession = await createGarageCheckoutSession(session.user.id, planId)
    } else {
      return NextResponse.json({ error: 'Invalid userType' }, { status: 400 })
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 