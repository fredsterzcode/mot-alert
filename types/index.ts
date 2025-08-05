import { User, Vehicle, Garage, Reminder, Message, Subscription } from '@prisma/client'

export type UserRole = 'DRIVER' | 'GARAGE' | 'ADMIN'
export type ReminderType = 'MOT' | 'TAX' | 'INSURANCE' | 'SERVICE'
export type MessageType = 'SMS' | 'EMAIL'
export type MessageStatus = 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED'
export type PlanType = 'STARTER' | 'PRO' | 'PREMIUM'
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID'

export interface UserWithRelations extends User {
  vehicles?: Vehicle[]
  reminders?: Reminder[]
  garage?: Garage
  subscription?: Subscription
  messages?: Message[]
}

export interface VehicleWithRelations extends Vehicle {
  user?: User
  garage?: Garage
  reminders?: Reminder[]
}

export interface ReminderWithRelations extends Reminder {
  user: User
  vehicle: Vehicle
  messages?: Message[]
}

export interface GarageWithRelations extends Garage {
  user: User
  vehicles?: Vehicle[]
  messages?: Message[]
}

export interface MessageWithRelations extends Message {
  user: User
  reminder?: Reminder
  garage?: Garage
}

export interface SubscriptionWithRelations extends Subscription {
  user: User
}

export interface ContactInfo {
  phone: string
  email: string
  address: string
  website?: string
}

export interface Branding {
  logo?: string
  colors: {
    primary: string
    secondary: string
  }
  customMessage?: string
}

export interface ReminderPreferences {
  mot: boolean
  tax: boolean
  insurance: boolean
  service: boolean
  sms: boolean
  email: boolean
}

export interface SignupFormData {
  name: string
  email: string
  phone: string
  registration: string
  reminderType: 'SMS' | 'EMAIL' | 'BOTH'
  preferences: ReminderPreferences
}

export interface GarageSignupFormData {
  name: string
  email: string
  phone: string
  password: string
  contactInfo: ContactInfo
  branding: Branding
}

export interface MOTData {
  registration: string
  make?: string
  model?: string
  color?: string
  motExpiryDate: Date
  taxExpiryDate?: Date
  insuranceExpiryDate?: Date
  serviceDueDate?: Date
}

export interface StripePlan {
  id: string
  name: string
  price: number
  reminders: number
  features: string[]
}

export interface DashboardStats {
  totalUsers: number
  totalGarages: number
  activeReminders: number
  pendingMessages: number
  monthlyRevenue: number
} 