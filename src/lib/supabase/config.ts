// Supabase configuration constants
export const SUPABASE_CONFIG = {
  MAX_RETRIES: 5,
  INITIAL_RETRY_DELAY: 1000,
  CONNECTION_TIMEOUT: 10000,    // 10 seconds
  REFRESH_INTERVAL: 30000,      // 30 seconds
  HEARTBEAT_INTERVAL: 15000     // 15 seconds
} as const;

export const AUTH_CONFIG = {
  email: 'abouelfetouhm@gmail.com',
  password: 'a5013463'
} as const;