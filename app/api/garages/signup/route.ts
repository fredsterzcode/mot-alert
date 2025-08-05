import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const garageSignupSchema = z.object({
  name: z.string().min(2, 'Garage name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string().email(),
    address: z.string(),
    website: z.string().optional(),
  }),
  branding: z.object({
    logo: z.string().optional(),
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
    }),
    customMessage: z.string().optional(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = garageSignupSchema.parse(body)

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

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user with garage role
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        role: 'GARAGE',
      }
    })

    // Create garage profile
    const garage = await prisma.garage.create({
      data: {
        userId: user.id,
        name: validatedData.name,
        logo: validatedData.branding.logo,
        contactInfo: validatedData.contactInfo,
        branding: validatedData.branding,
      }
    })

    // Create default subscription (Starter plan)
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'STARTER',
        usageLimit: 100,
        status: 'ACTIVE',
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      garage: {
        id: garage.id,
        name: garage.name,
        logo: garage.logo,
      },
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        usageLimit: subscription.usageLimit,
      },
    })

  } catch (error) {
    console.error('Garage signup error:', error)
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