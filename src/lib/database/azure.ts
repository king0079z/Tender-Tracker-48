import { Client, Pool } from 'pg';
import { DatabaseConfig } from './types';

const getConfig = (): DatabaseConfig => {
  if (!process.env.AZURE_POSTGRESQL_CONNECTIONSTRING) {
    throw new Error('AZURE_POSTGRESQL_CONNECTIONSTRING environment variable is not set');
  }

  return {
    connectionString: process.env.AZURE_POSTGRESQL_CONNECTIONSTRING,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000
  };
};

class AzureDatabase {
  private pool: Pool;
  private static instance: AzureDatabase;
  private isConnected: boolean = false;
  private connectionListeners: Set<(isConnected: boolean) => void> = new Set();
  private reconnectTimer: number | null = null;
  private healthCheckTimer: number | null = null;

  private constructor() {
    this.pool = new Pool(getConfig());
    this.setupPoolErrorHandling();
    this.startHealthCheck();
  }

  // Rest of the class implementation remains the same
  // ... (keeping existing methods)
}

export const db = AzureDatabase.getInstance();