import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send MOT reminder email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @returns {Promise} - Email send result
 */
export async function sendMOTEmail(to, subject, html) {
  try {
    const data = await resend.emails.send({
      from: 'MOT Alert <noreply@mot-alert.com>',
      to: [to],
      subject: subject,
      html: html,
    });
    
    console.log('Email sent:', data);
    return data;
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
}

/**
 * Email templates for different MOT reminders
 */
export const EmailTemplates = {
  // Welcome email
  welcome: (userName, vehicleReg) => ({
    subject: `Welcome to MOT Alert - ${vehicleReg}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to MOT Alert! 🚗</h2>
        <p>Hi ${userName},</p>
        <p>Welcome to MOT Alert! We'll keep you updated about your vehicle <strong>${vehicleReg}</strong>.</p>
        <p>We'll send you reminders for:</p>
        <ul>
          <li>MOT test due dates</li>
          <li>Road tax renewals</li>
          <li>Insurance renewals</li>
        </ul>
        <p>Stay safe on the roads!</p>
        <p>Best regards,<br>The MOT Alert Team</p>
      </div>
    `
  }),

  // 1 month before MOT
  oneMonth: (userName, vehicleReg, dueDate) => ({
    subject: `MOT Alert: ${vehicleReg} due in 1 month`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">MOT Reminder ⚠️</h2>
        <p>Hi ${userName},</p>
        <p>Your vehicle <strong>${vehicleReg}</strong> MOT is due on <strong>${dueDate}</strong>.</p>
        <p>That's in 1 month - time to book your test!</p>
        <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Book your MOT test:</strong></p>
          <p>• Find a local garage at <a href="https://www.gov.uk/mot">gov.uk/mot</a></p>
          <p>• Book online or call your preferred garage</p>
          <p>• Cost: £54.85 for most vehicles</p>
        </div>
        <p>Don't risk driving without a valid MOT!</p>
        <p>Best regards,<br>The MOT Alert Team</p>
      </div>
    `
  }),

  // 2 weeks before MOT
  twoWeeks: (userName, vehicleReg, dueDate) => ({
    subject: `MOT Alert: ${vehicleReg} due in 2 weeks`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">MOT Due Soon! 🚨</h2>
        <p>Hi ${userName},</p>
        <p>Your vehicle <strong>${vehicleReg}</strong> MOT is due on <strong>${dueDate}</strong>.</p>
        <p>That's in 2 weeks - book your test now!</p>
        <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Quick booking options:</strong></p>
          <p>• <a href="https://www.gov.uk/mot">Book online at gov.uk</a></p>
          <p>• Call your local garage</p>
          <p>• Use comparison sites for best prices</p>
        </div>
        <p>Don't forget - driving without MOT is illegal!</p>
        <p>Best regards,<br>The MOT Alert Team</p>
      </div>
    `
  }),

  // 2 days before MOT
  twoDays: (userName, vehicleReg, dueDate) => ({
    subject: `URGENT: ${vehicleReg} MOT due in 2 days`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">URGENT MOT REMINDER! 🚨</h2>
        <p>Hi ${userName},</p>
        <p>Your vehicle <strong>${vehicleReg}</strong> MOT is due on <strong>${dueDate}</strong>.</p>
        <p><strong>That's in 2 days!</strong></p>
        <div style="background: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>⚠️ URGENT ACTION REQUIRED:</strong></p>
          <p>• Book your MOT test immediately</p>
          <p>• Don't drive without valid MOT</p>
          <p>• Risk of £1,000 fine if caught</p>
        </div>
        <p>Book now at <a href="https://www.gov.uk/mot">gov.uk/mot</a></p>
        <p>Best regards,<br>The MOT Alert Team</p>
      </div>
    `
  }),

  // Day of MOT
  dayOf: (userName, vehicleReg, dueDate) => ({
    subject: `TODAY: ${vehicleReg} MOT is due`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">MOT DUE TODAY! 🚨</h2>
        <p>Hi ${userName},</p>
        <p>Your vehicle <strong>${vehicleReg}</strong> MOT is due <strong>TODAY (${dueDate})</strong>.</p>
        <div style="background: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>🚨 CRITICAL:</strong></p>
          <p>• You CANNOT drive legally without MOT</p>
          <p>• Book test immediately</p>
          <p>• Risk of £1,000 fine + points</p>
        </div>
        <p>Book now at <a href="https://www.gov.uk/mot">gov.uk/mot</a></p>
        <p>Best regards,<br>The MOT Alert Team</p>
      </div>
    `
  }),

  // Tax reminder
  taxReminder: (userName, vehicleReg, dueDate) => ({
    subject: `Road Tax Reminder: ${vehicleReg}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Road Tax Reminder 🚗</h2>
        <p>Hi ${userName},</p>
        <p>Your vehicle <strong>${vehicleReg}</strong> road tax is due on <strong>${dueDate}</strong>.</p>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Renew online:</strong></p>
          <p>• Visit <a href="https://www.gov.uk/vehicle-tax">gov.uk/vehicle-tax</a></p>
          <p>• Use your V5C log book</p>
          <p>• Pay by direct debit or card</p>
        </div>
        <p>Best regards,<br>The MOT Alert Team</p>
      </div>
    `
  }),

  // Insurance reminder
  insuranceReminder: (userName, vehicleReg, dueDate) => ({
    subject: `Insurance Reminder: ${vehicleReg}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Insurance Reminder 🛡️</h2>
        <p>Hi ${userName},</p>
        <p>Your vehicle <strong>${vehicleReg}</strong> insurance expires on <strong>${dueDate}</strong>.</p>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Renew your insurance:</strong></p>
          <p>• Contact your current insurer</p>
          <p>• Compare quotes online</p>
          <p>• Don't drive without insurance!</p>
        </div>
        <p>Best regards,<br>The MOT Alert Team</p>
      </div>
    `
  })
};

/**
 * Send reminder email based on type
 */
export async function sendReminderEmail(to, userName, type, vehicleReg, dueDate) {
  const template = EmailTemplates[type](userName, vehicleReg, dueDate);
  return await sendMOTEmail(to, template.subject, template.html);
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(to, userName, vehicleReg) {
  const template = EmailTemplates.welcome(userName, vehicleReg);
  return await sendMOTEmail(to, template.subject, template.html);
}

/**
 * Send upgrade reminder email
 */
export async function sendUpgradeEmail(to, userName) {
  const subject = 'Upgrade to Premium for SMS Reminders';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Upgrade to Premium! 📱</h2>
      <p>Hi ${userName},</p>
      <p>Get instant SMS reminders for your MOT, tax, and insurance!</p>
      <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Premium Benefits:</strong></p>
        <p>• Instant SMS alerts</p>
        <p>• Never miss a deadline</p>
        <p>• Only £1.99/month</p>
      </div>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/subscription" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Upgrade Now</a></p>
      <p>Best regards,<br>The MOT Alert Team</p>
    </div>
  `;
  return await sendMOTEmail(to, subject, html);
} 