import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    // If no subscription exists for a driver, create a free one
    if (!subscription && session.user.role === 'DRIVER') {
      const newSubscription = await prisma.subscription.create({
        data: {
          userId: session.user.id,
          plan: 'DRIVER_FREE',
          status: 'ACTIVE',
          reminderLimit: null,
          usageCount: 0,
        }
      })
      return NextResponse.json({ subscription: newSubscription })
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
} 