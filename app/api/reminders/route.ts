import { NextRequest, NextResponse } from 'next/server'
import { processDueReminders, retryFailedMessages } from '@/lib/reminders'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'process') {
      await processDueReminders()
      return NextResponse.json({ success: true, message: 'Reminders processed successfully' })
    } else if (action === 'retry') {
      await retryFailedMessages()
      return NextResponse.json({ success: true, message: 'Failed messages retried successfully' })
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Reminder processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    
    const reminders = await prisma.reminder.findMany({
      where: { userId },
      include: {
        vehicle: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json({ reminders })
  } catch (error) {
    console.error('Get reminders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 