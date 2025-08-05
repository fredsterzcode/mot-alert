import { sql } from '@vercel/postgres';

// Check if database is available
const isDatabaseAvailable = () => {
  return process.env.POSTGRES_URL || (process.env.POSTGRES_HOST && process.env.POSTGRES_DATABASE);
};

/**
 * Database setup and utility functions
 */

// Initialize database tables
export async function initializeDatabase() {
  try {
    if (!isDatabaseAvailable()) {
      console.warn('Database not configured - skipping initialization');
      return;
    }
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        name VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        is_premium BOOLEAN DEFAULT FALSE,
        stripe_customer_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create vehicles table
    await sql`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        registration VARCHAR(20) NOT NULL,
        make VARCHAR(100),
        model VARCHAR(100),
        year INTEGER,
        mot_due_date DATE,
        tax_due_date DATE,
        insurance_due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create messages table (SMS)
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        message_text TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create emails table
    await sql`
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        email_address VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create subscriptions table
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        stripe_subscription_id VARCHAR(255) UNIQUE,
        status VARCHAR(20) DEFAULT 'active',
        plan_type VARCHAR(20) DEFAULT 'premium',
        amount INTEGER DEFAULT 199, -- £1.99 in pence
        currency VARCHAR(3) DEFAULT 'GBP',
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

/**
 * User management functions
 */
export async function createUser(email, name = null, phone = null) {
  try {
    if (!isDatabaseAvailable()) {
      console.warn('Database not configured - returning mock user');
      return {
        id: 1,
        email,
        name,
        phone,
        is_verified: false,
        is_premium: false,
        created_at: new Date(),
        updated_at: new Date()
      };
    }
    
    const result = await sql`
      INSERT INTO users (email, name, phone)
      VALUES (${email}, ${name}, ${phone})
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function updateUser(id, updates) {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    
    const result = await sql.query(query, [id, ...values]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Vehicle management functions
 */
export async function createVehicle(userId, vehicleData) {
  try {
    const { registration, make, model, year, motDueDate, taxDueDate, insuranceDueDate } = vehicleData;
    
    const result = await sql`
      INSERT INTO vehicles (user_id, registration, make, model, year, mot_due_date, tax_due_date, insurance_due_date)
      VALUES (${userId}, ${registration}, ${make}, ${model}, ${year}, ${motDueDate}, ${taxDueDate}, ${insuranceDueDate})
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}

export async function getUserVehicles(userId) {
  try {
    const result = await sql`
      SELECT * FROM vehicles WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting user vehicles:', error);
    throw error;
  }
}

export async function getVehicleById(id) {
  try {
    const result = await sql`
      SELECT * FROM vehicles WHERE id = ${id}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting vehicle:', error);
    throw error;
  }
}

export async function updateVehicle(id, updates) {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE vehicles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    
    const result = await sql.query(query, [id, ...values]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
}

/**
 * Message/SMS management functions
 */
export async function createMessage(userId, vehicleId, type, phoneNumber, messageText) {
  try {
    const result = await sql`
      INSERT INTO messages (user_id, vehicle_id, type, phone_number, message_text)
      VALUES (${userId}, ${vehicleId}, ${type}, ${phoneNumber}, ${messageText})
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

export async function updateMessageStatus(id, status, sentAt = null) {
  try {
    const result = await sql`
      UPDATE messages 
      SET status = ${status}, sent_at = ${sentAt || 'CURRENT_TIMESTAMP'}
      WHERE id = ${id}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
}

export async function getUserMessages(userId) {
  try {
    const result = await sql`
      SELECT m.*, v.registration 
      FROM messages m
      LEFT JOIN vehicles v ON m.vehicle_id = v.id
      WHERE m.user_id = ${userId}
      ORDER BY m.created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting user messages:', error);
    throw error;
  }
}

/**
 * Email management functions
 */
export async function createEmail(userId, vehicleId, type, emailAddress, subject) {
  try {
    const result = await sql`
      INSERT INTO emails (user_id, vehicle_id, type, email_address, subject)
      VALUES (${userId}, ${vehicleId}, ${type}, ${emailAddress}, ${subject})
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating email:', error);
    throw error;
  }
}

export async function updateEmailStatus(id, status, sentAt = null) {
  try {
    const result = await sql`
      UPDATE emails 
      SET status = ${status}, sent_at = ${sentAt || 'CURRENT_TIMESTAMP'}
      WHERE id = ${id}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error updating email status:', error);
    throw error;
  }
}

export async function getUserEmails(userId) {
  try {
    const result = await sql`
      SELECT e.*, v.registration 
      FROM emails e
      LEFT JOIN vehicles v ON e.vehicle_id = v.id
      WHERE e.user_id = ${userId}
      ORDER BY e.created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting user emails:', error);
    throw error;
  }
}

/**
 * Subscription management functions
 */
export async function createSubscription(userId, stripeSubscriptionId, planType = 'premium', amount = 199) {
  try {
    const result = await sql`
      INSERT INTO subscriptions (user_id, stripe_subscription_id, plan_type, amount)
      VALUES (${userId}, ${stripeSubscriptionId}, ${planType}, ${amount})
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function getUserSubscription(userId) {
  try {
    const result = await sql`
      SELECT * FROM subscriptions 
      WHERE user_id = ${userId} AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    throw error;
  }
}

export async function updateSubscriptionStatus(stripeSubscriptionId, status) {
  try {
    const result = await sql`
      UPDATE subscriptions 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = ${stripeSubscriptionId}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
}

/**
 * Utility functions
 */
export async function getUsersWithUpcomingMOTs(daysAhead = 30) {
  try {
    const result = await sql`
      SELECT u.id, u.email, u.phone, u.name, v.id as vehicle_id, v.registration, v.mot_due_date
      FROM users u
      JOIN vehicles v ON u.id = v.user_id
      WHERE v.mot_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${daysAhead} days'
      AND u.is_verified = true
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting users with upcoming MOTs:', error);
    throw error;
  }
}

export async function getUsersWithUpcomingTax(daysAhead = 30) {
  try {
    const result = await sql`
      SELECT u.id, u.email, u.phone, u.name, v.id as vehicle_id, v.registration, v.tax_due_date
      FROM users u
      JOIN vehicles v ON u.id = v.user_id
      WHERE v.tax_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${daysAhead} days'
      AND u.is_verified = true
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting users with upcoming tax:', error);
    throw error;
  }
}

export async function getUsersWithUpcomingInsurance(daysAhead = 30) {
  try {
    const result = await sql`
      SELECT u.id, u.email, u.phone, u.name, v.id as vehicle_id, v.registration, v.insurance_due_date
      FROM users u
      JOIN vehicles v ON u.id = v.user_id
      WHERE v.insurance_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${daysAhead} days'
      AND u.is_verified = true
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting users with upcoming insurance:', error);
    throw error;
  }
} 