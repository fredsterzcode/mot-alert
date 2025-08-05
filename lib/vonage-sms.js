import { Vonage } from '@vonage/server-sdk';

// Initialize Vonage
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

/**
 * Send MOT reminder SMS
 * @param {string} phoneNumber - User's phone number (with country code)
 * @param {string} message - Custom message
 * @returns {Promise} - SMS send result
 */
export async function sendMOTReminder(phoneNumber, message) {
  return new Promise((resolve, reject) => {
    vonage.sms.send({
      from: 'MOT Alert',
      to: phoneNumber,
      text: message,
    }, (err, responseData) => {
      if (err) {
        console.error('SMS Error:', err);
        reject(err);
      } else {
        console.log('SMS Sent:', responseData);
        resolve(responseData);
      }
    });
  });
}

/**
 * Send different types of MOT reminders
 */
export const MOTReminders = {
  // 1 month before
  oneMonth: (vehicleReg, dueDate) => 
    `MOT Alert: Your ${vehicleReg} MOT is due on ${dueDate}. Book your test now to avoid fines. Reply STOP to unsubscribe.`,
  
  // 2 weeks before
  twoWeeks: (vehicleReg, dueDate) => 
    `MOT Alert: Your ${vehicleReg} MOT is due in 2 weeks (${dueDate}). Don't forget to book your test! Reply STOP to unsubscribe.`,
  
  // 2 days before
  twoDays: (vehicleReg, dueDate) => 
    `MOT Alert: Your ${vehicleReg} MOT is due in 2 days (${dueDate}). Book immediately to avoid driving illegally! Reply STOP to unsubscribe.`,
  
  // Day of
  dayOf: (vehicleReg, dueDate) => 
    `MOT Alert: Your ${vehicleReg} MOT is due TODAY (${dueDate}). You cannot drive legally without a valid MOT! Reply STOP to unsubscribe.`,
  
  // Tax reminder
  taxReminder: (vehicleReg, dueDate) => 
    `MOT Alert: Your ${vehicleReg} road tax is due on ${dueDate}. Renew online at gov.uk. Reply STOP to unsubscribe.`,
  
  // Insurance reminder
  insuranceReminder: (vehicleReg, dueDate) => 
    `MOT Alert: Your ${vehicleReg} insurance expires on ${dueDate}. Renew to stay legal. Reply STOP to unsubscribe.`,
};

/**
 * Send reminder based on type
 */
export async function sendReminder(phoneNumber, type, vehicleReg, dueDate) {
  const message = MOTReminders[type](vehicleReg, dueDate);
  return await sendMOTReminder(phoneNumber, message);
}

/**
 * Send welcome SMS
 */
export async function sendWelcomeSMS(phoneNumber, vehicleReg) {
  const message = `Welcome to MOT Alert! We'll remind you about your ${vehicleReg} MOT, tax, and insurance. Reply STOP anytime to unsubscribe.`;
  return await sendMOTReminder(phoneNumber, message);
}

/**
 * Send upgrade reminder
 */
export async function sendUpgradeReminder(phoneNumber) {
  const message = `Upgrade to Premium for SMS reminders! Get instant alerts for MOT, tax & insurance. £1.99/month. Reply UPGRADE for details.`;
  return await sendMOTReminder(phoneNumber, message);
} 