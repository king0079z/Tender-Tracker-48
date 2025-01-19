import { DatabaseConfig, DatabaseProvider } from './types';
import { SupabaseProvider } from './providers/supabase';
import { CustomDatabaseProvider } from './providers/custom';

export function createDatabaseProvider(config: DatabaseConfig): DatabaseProvider {
  if (!config.connectionString) {
    throw new Error('Database connection string is required');
  }

  switch (config.type) {
    case 'supabase':
      return new SupabaseProvider(config);
    case 'custom':
      return new CustomDatabaseProvider(config);
    default:
      throw new Error(`Unsupported database type: ${config.type}`);
  }
}