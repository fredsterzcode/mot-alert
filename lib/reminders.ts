import { prisma } from './prisma'
import { formatDate, getReminderDates, getPlanFeatures } from './utils'
import { sendSMS } from './twilio'
import { sendEmail } from './sendgrid'

export async function createReminders(vehicleId: string, userId: string, motExpiryDate: Date) {
  const reminderDates = getReminderDates(motExpiryDate)
  const now = new Date()

  const reminders = []

  // Create reminders for future dates only
  for (const [type, date] of Object.entries(reminderDates)) {
    if (date > now) {
      reminders.push({
        type: 'MOT' as const,
        dueDate: date,
        userId,
        vehicleId,
      })
    }
  }

  if (reminders.length > 0) {
    await prisma.reminder.createMany({
      data: reminders
    })
  }

  return reminders
}

export async function processDueReminders() {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  // Get all reminders due today or tomorrow
  const dueReminders = await prisma.reminder.findMany({
    where: {
      dueDate: {
        gte: now,
        lte: tomorrow,
      },
      isActive: true,
    },
    include: {
      user: {
        include: {
          subscription: true
        }
      },
      vehicle: true,
      messages: {
        where: {
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
          }
        }
      }
    }
  })

  for (const reminder of dueReminders) {
    // Check if we've already sent a message for this reminder today
    if (reminder.messages.length > 0) {
      continue
    }

    // Check subscription status and limits
    const canSendReminder = await checkSubscriptionLimits(reminder)
    if (!canSendReminder) {
      continue
    }

    await sendReminderMessage(reminder)
  }
}

async function checkSubscriptionLimits(reminder: any): Promise<boolean> {
  const user = reminder.user
  const subscription = user.subscription

  // If no subscription, create a free driver subscription
  if (!subscription && user.role === 'DRIVER') {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'DRIVER_FREE',
        status: 'ACTIVE',
        reminderLimit: null,
        usageCount: 0,
      }
    })
    return true
  }

  // Check if subscription is active
  if (subscription && subscription.status !== 'ACTIVE') {
    console.log(`User ${user.id} has inactive subscription: ${subscription.status}`)
    return false
  }

  // Check usage limits for garage subscriptions
  if (user.role === 'GARAGE' && subscription) {
    if (subscription.reminderLimit && subscription.usageCount >= subscription.reminderLimit) {
      console.log(`Garage ${user.id} has reached their usage limit`)
      return false
    }
  }

  return true
}

async function sendReminderMessage(reminder: any) {
  try {
    const user = reminder.user
    const vehicle = reminder.vehicle
    const subscription = user.subscription

    // Get garage info if this is a garage reminder
    let garage = null
    if (user.role === 'GARAGE') {
      garage = await prisma.garage.findUnique({
        where: { userId: user.id }
      })
    }

    const motDate = formatDate(vehicle.motExpiryDate)
    const registration = vehicle.registration

    // Get plan features
    const planFeatures = getPlanFeatures(subscription?.plan || 'DRIVER_FREE')

    // Create message content
    let smsContent = `Hi ${user.name}, your MOT for ${registration} is due on ${motDate}.`
    let emailSubject = `MOT Reminder - ${registration}`
    let emailContent = `Hi ${user.name},<br><br>Your MOT for ${registration} is due on ${motDate}.<br><br>Please book your MOT test soon to avoid any issues.`

    // Add garage branding if available
    if (garage) {
      const contactInfo = garage.contactInfo as any
      smsContent += ` Book now with ${garage.name}. Call ${contactInfo.phone} or visit ${contactInfo.website || 'our website'}.`
      emailContent += `<br><br>Book with ${garage.name}:<br>Phone: ${contactInfo.phone}<br>Website: ${contactInfo.website || 'N/A'}`
    }

    // Add partner garage ads for free tier drivers
    if (user.role === 'DRIVER' && planFeatures.ads) {
      const partnerGarage = await getRandomPartnerGarage()
      if (partnerGarage) {
        const contactInfo = partnerGarage.contactInfo as any
        emailContent += `<br><br>💡 Partner Garage Recommendation:<br>${partnerGarage.name}<br>Phone: ${contactInfo.phone}<br>Website: ${contactInfo.website || 'N/A'}`
      }
    }

    // Send SMS if user has phone and plan supports SMS
    if (user.phone && planFeatures.channels.includes('SMS')) {
      const smsMessage = await prisma.message.create({
        data: {
          type: 'SMS',
          content: smsContent,
          userId: user.id,
          reminderId: reminder.id,
          garageId: garage?.id,
        }
      })

      try {
        await sendSMS(user.phone, smsContent)
        await prisma.message.update({
          where: { id: smsMessage.id },
          data: { status: 'SENT', sentAt: new Date() }
        })
        
        // Increment usage count
        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              usageCount: {
                increment: 1
              }
            }
          })
        }
      } catch (error) {
        await prisma.message.update({
          where: { id: smsMessage.id },
          data: { status: 'FAILED', error: error.message }
        })
      }
    }

    // Send email if plan supports email
    if (planFeatures.channels.includes('EMAIL')) {
      const emailMessage = await prisma.message.create({
        data: {
          type: 'EMAIL',
          content: emailContent,
          userId: user.id,
          reminderId: reminder.id,
          garageId: garage?.id,
        }
      })

      try {
        await sendEmail(user.email, emailSubject, emailContent)
        await prisma.message.update({
          where: { id: emailMessage.id },
          data: { status: 'SENT', sentAt: new Date() }
        })
        
        // Increment usage count
        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              usageCount: {
                increment: 1
              }
            }
          })
        }
      } catch (error) {
        await prisma.message.update({
          where: { id: emailMessage.id },
          data: { status: 'FAILED', error: error.message }
        })
      }
    }

  } catch (error) {
    console.error('Error sending reminder message:', error)
  }
}

async function getRandomPartnerGarage() {
  // Get a random garage that has opted in to partner promotions
  const partnerGarages = await prisma.garage.findMany({
    where: {
      user: {
        subscription: {
          status: 'ACTIVE'
        }
      }
    },
    take: 1,
    orderBy: {
      id: 'asc' // Simple random selection
    }
  })

  return partnerGarages[0] || null
}

export async function retryFailedMessages() {
  const failedMessages = await prisma.message.findMany({
    where: {
      status: 'FAILED',
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    include: {
      user: true,
      reminder: {
        include: {
          vehicle: true
        }
      }
    }
  })

  for (const message of failedMessages) {
    try {
      if (message.type === 'SMS' && message.user.phone) {
        await sendSMS(message.user.phone, message.content)
        await prisma.message.update({
          where: { id: message.id },
          data: { status: 'SENT', sentAt: new Date() }
        })
      } else if (message.type === 'EMAIL') {
        await sendEmail(message.user.email, 'MOT Reminder', message.content)
        await prisma.message.update({
          where: { id: message.id },
          data: { status: 'SENT', sentAt: new Date() }
        })
      }
    } catch (error) {
      console.error(`Failed to retry message ${message.id}:`, error)
    }
  }
} 