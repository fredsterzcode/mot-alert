import { getUserByEmail, getUserById } from './supabase';

/**
 * Simple authentication middleware
 * In production, you'd want proper JWT tokens or session management
 */

// Simple session storage (in production, use Redis or database)
const sessions = new Map();

/**
 * Generate a simple session token
 */
export function generateSessionToken(userId) {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessions.set(token, { userId, createdAt: Date.now() });
  return token;
}

/**
 * Validate session token
 */
export function validateSessionToken(token) {
  const session = sessions.get(token);
  if (!session) return null;
  
  // Check if session is expired (24 hours)
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    sessions.delete(token);
    return null;
  }
  
  return session.userId;
}

/**
 * Extract user from request headers
 */
export async function getCurrentUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const userId = validateSessionToken(token);
    
    if (!userId) {
      return null;
    }
    
    // Get user from database
    const user = await getUserById(userId);
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Require authentication middleware
 */
export async function requireAuth(request) {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Clean up expired sessions (run periodically)
 */
export function cleanupSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now - session.createdAt > 24 * 60 * 60 * 1000) {
      sessions.delete(token);
    }
  }
}

// Clean up sessions every hour
setInterval(cleanupSessions, 60 * 60 * 1000); 