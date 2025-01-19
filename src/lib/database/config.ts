import { parse } from 'pg-connection-string';
import { DatabaseConfig } from './types';

// Parse Azure PostgreSQL connection string
const getConnectionConfig = (): DatabaseConfig => {
  const connectionString = process.env.AZURE_POSTGRESQL_CONNECTIONSTRING;
  
  if (!connectionString) {
    throw new Error('AZURE_POSTGRESQL_CONNECTIONSTRING environment variable is not set');
  }
  
  return {
    connectionString,
    ssl: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.3'
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000
  };
};

export const dbConfig = getConnectionConfig();

// Validate configuration
export const validateConfig = () => {
  if (!process.env.AZURE_POSTGRESQL_CONNECTIONSTRING) {
    throw new Error(
      'Database connection string is not configured. Please set AZURE_POSTGRESQL_CONNECTIONSTRING environment variable.'
    );
  }
  
  return true;
};