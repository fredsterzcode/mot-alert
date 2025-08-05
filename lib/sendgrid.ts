import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendEmail(to: string, subject: string, htmlContent: string) {
  try {
    const msg = {
      to: to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MOT Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 MOT Alert</h1>
            </div>
            <div class="content">
              ${htmlContent}
              <br><br>
              <p>Best regards,<br>The MOT Alert Team</p>
            </div>
            <div class="footer">
              <p>This email was sent by MOT Alert. To unsubscribe, please contact us.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const result = await sgMail.send(msg)
    console.log(`Email sent to ${to}: ${result[0].statusCode}`)
    return result
  } catch (error) {
    console.error('SendGrid email error:', error)
    throw error
  }
}

export async function sendWelcomeEmail(to: string, name: string, motDate: string, registration: string) {
  const subject = `Welcome to MOT Alert - Your MOT is due on ${motDate}`
  const htmlContent = `
    <h2>Welcome to MOT Alert, ${name}!</h2>
    <p>Thank you for signing up for MOT reminders. We'll keep you informed about your vehicle's MOT status.</p>
    <br>
    <h3>Your Vehicle Details:</h3>
    <ul>
      <li><strong>Registration:</strong> ${registration}</li>
      <li><strong>MOT Due Date:</strong> ${motDate}</li>
    </ul>
    <br>
    <p>We'll send you reminders:</p>
    <ul>
      <li>1 month before your MOT is due</li>
      <li>2 weeks before your MOT is due</li>
      <li>2 days before your MOT is due</li>
    </ul>
    <br>
    <p>You can manage your preferences anytime by logging into your account.</p>
  `

  return sendEmail(to, subject, htmlContent)
} 