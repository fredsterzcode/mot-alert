import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addDays, addWeeks, addMonths } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, "dd MMM yyyy")
}

export function formatDateTime(date: Date): string {
  return format(date, "dd MMM yyyy HH:mm")
}

export function getReminderDates(motExpiryDate: Date) {
  return {
    oneMonth: addMonths(motExpiryDate, -1),
    twoWeeks: addWeeks(motExpiryDate, -2),
    twoDays: addDays(motExpiryDate, -2),
  }
}

export function formatRegistration(registration: string): string {
  return registration.toUpperCase().replace(/\s/g, '')
}

export function validateRegistration(registration: string): boolean {
  // UK registration format validation
  const ukRegPattern = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$|^[A-Z][0-9]{3}\s?[A-Z]{3}$|^[A-Z]{3}[0-9]{3}$|^[0-9]{3}\s?[A-Z]{3}$|^[A-Z]{1,3}[0-9]{1,4}\s?[A-Z]{1,3}$/i
  return ukRegPattern.test(registration.replace(/\s/g, ''))
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Add UK country code if not present
  if (cleaned.startsWith('44')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `+44${cleaned.slice(1)}`
  } else if (cleaned.length === 10) {
    return `+44${cleaned}`
  }
  
  return `+${cleaned}`
}

export function generateMOTDate(): Date {
  // Generate a random MOT date within the next 12 months
  const now = new Date()
  const futureDate = new Date(now.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000)
  return futureDate
}

export function getPlanLimits(plan: string) {
  const limits = {
    DRIVER_FREE: null, // Unlimited reminders for free tier
    DRIVER_PREMIUM: null, // Unlimited reminders for premium tier
    GARAGE_STARTER: 100,
    GARAGE_PRO: 500,
    GARAGE_PREMIUM: null, // Unlimited
  }
  return limits[plan as keyof typeof limits] || 100
}

export function getPlanPrice(plan: string) {
  const prices = {
    DRIVER_FREE: 0,
    DRIVER_PREMIUM: 1.99, // Monthly price
    DRIVER_PREMIUM_ANNUAL: 19.99, // Annual price
    GARAGE_STARTER: 15,
    GARAGE_PRO: 45,
    GARAGE_PREMIUM: 99,
  }
  return prices[plan as keyof typeof prices] || 0
}

export function getPlanFeatures(plan: string) {
  const features = {
    DRIVER_FREE: {
      reminders: ['MOT'],
      channels: ['EMAIL'],
      vehicles: 1,
      ads: true,
      customSchedules: false,
      prioritySupport: false,
    },
    DRIVER_PREMIUM: {
      reminders: ['MOT', 'TAX', 'INSURANCE', 'SERVICE'],
      channels: ['EMAIL', 'SMS'],
      vehicles: 3,
      ads: false,
      customSchedules: true,
      prioritySupport: true,
    },
    GARAGE_STARTER: {
      reminders: ['MOT'],
      channels: ['EMAIL', 'SMS'],
      vehicles: null, // No limit for garages
      ads: false,
      customSchedules: true,
      prioritySupport: false,
    },
    GARAGE_PRO: {
      reminders: ['MOT', 'TAX', 'INSURANCE', 'SERVICE'],
      channels: ['EMAIL', 'SMS'],
      vehicles: null,
      ads: false,
      customSchedules: true,
      prioritySupport: true,
    },
    GARAGE_PREMIUM: {
      reminders: ['MOT', 'TAX', 'INSURANCE', 'SERVICE'],
      channels: ['EMAIL', 'SMS'],
      vehicles: null,
      ads: false,
      customSchedules: true,
      prioritySupport: true,
    },
  }
  return features[plan as keyof typeof features] || features.DRIVER_FREE
} 