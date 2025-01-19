import { DatabaseConfig } from '../lib/database/types';

export function getDatabaseConfig(): DatabaseConfig {
  // Read from environment variables or configuration file
  const dbType = import.meta.env.VITE_DB_TYPE || 'supabase';
  
  if (dbType === 'supabase') {
    return {
      type: 'supabase',
      url: import.meta.env.VITE_SUPABASE_URL,
      credentials: {
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
      }
    };
  }
  
  // Custom database configuration
  return {
    type: 'custom',
    url: import.meta.env.VITE_DB_URL,
    credentials: {
      username: import.meta.env.VITE_DB_USERNAME,
      password: import.meta.env.VITE_DB_PASSWORD,
      // Add any other required credentials
    }
  };
}