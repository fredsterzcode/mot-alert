import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { validateRegistration, formatRegistration, formatPhoneNumber, generateMOTDate } from '@/lib/utils'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  registration: z.string().min(2, 'Registration is required'),
  reminderType: z.enum(['SMS', 'EMAIL', 'BOTH']),
  preferences: z.object({
    mot: z.boolean(),
    tax: z.boolean(),
    insurance: z.boolean(),
    service: z.boolean(),
    sms: z.boolean(),
    email: z.boolean(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Validate registration format
    if (!validateRegistration(validatedData.registration)) {
      return NextResponse.json(
        { error: 'Invalid registration format' },
        { status: 400 }
      )
    }

    // Check if vehicle already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { registration: formatRegistration(validatedData.registration) }
    })

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle with this registration already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('temp-password', 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: formatPhoneNumber(validatedData.phone),
        password: hashedPassword,
        role: 'DRIVER',
      }
    })

    // Generate MOT date (mock DVLA API)
    const motExpiryDate = generateMOTDate()

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        registration: formatRegistration(validatedData.registration),
        motExpiryDate,
        userId: user.id,
      }
    })

    // Create reminders based on preferences
    const reminders = []
    if (validatedData.preferences.mot) {
      const reminderDates = {
        oneMonth: new Date(motExpiryDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        twoWeeks: new Date(motExpiryDate.getTime() - 14 * 24 * 60 * 60 * 1000),
        twoDays: new Date(motExpiryDate.getTime() - 2 * 24 * 60 * 60 * 1000),
      }

      for (const [type, date] of Object.entries(reminderDates)) {
        if (date > new Date()) {
          reminders.push({
            type: 'MOT' as const,
            dueDate: date,
            userId: user.id,
            vehicleId: vehicle.id,
          })
        }
      }
    }

    if (reminders.length > 0) {
      await prisma.reminder.createMany({
        data: reminders
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      vehicle: {
        id: vehicle.id,
        registration: vehicle.registration,
        motExpiryDate: vehicle.motExpiryDate,
      },
      reminders: reminders.length,
    })

  } catch (error) {
    console.error('Signup error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 