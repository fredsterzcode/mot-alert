import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function sendSMS(to: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: to,
    })

    console.log(`SMS sent to ${to}: ${result.sid}`)
    return result
  } catch (error) {
    console.error('Twilio SMS error:', error)
    throw error
  }
}

export async function verifyPhoneNumber(phoneNumber: string) {
  try {
    // This would typically use Twilio's phone number verification service
    // For now, we'll just validate the format
    const cleanNumber = phoneNumber.replace(/\D/g, '')
    return cleanNumber.length >= 10
  } catch (error) {
    console.error('Phone verification error:', error)
    return false
  }
} 