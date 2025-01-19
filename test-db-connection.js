import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const { Pool } = pg;

async function testDatabaseConnection() {
  console.log('Starting database connection tests...\n');

  if (!process.env.AZURE_POSTGRESQL_CONNECTIONSTRING) {
    console.error('Error: AZURE_POSTGRESQL_CONNECTIONSTRING environment variable is not set');
    process.exit(1);
  }

  const config = {
    connectionString: process.env.AZURE_POSTGRESQL_CONNECTIONSTRING,
    ssl: { 
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.3'
    },
    // Connection pool settings
    max: 1, // Single connection for testing
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 5000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 1000
  };

  // Environment check
  console.log('Environment Check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
  console.log('- Connection string:', process.env.AZURE_POSTGRESQL_CONNECTIONSTRING ? '✅' : '❌');
  console.log('- SSL enabled:', config.ssl ? '✅' : '❌');
  console.log('\n');

  // DNS lookup test
  console.log('Test 1: DNS Resolution');
  try {
    const dns = await import('dns');
    const { hostname } = new URL(process.env.AZURE_POSTGRESQL_CONNECTIONSTRING);
    const addresses = await dns.promises.resolve4(hostname);
    console.log('✅ DNS resolution successful');
    console.log('IP addresses:', addresses);
  } catch (error) {
    console.error('❌ DNS resolution failed:', error.message);
  }
  console.log('\n');

  // Test basic connection
  console.log('Test 2: Database Connection');
  const pool = new Pool(config);
  
  try {
    console.log('Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connection successful');
    
    // Test query
    console.log('Testing query...');
    const result = await client.query('SELECT version()');
    console.log('✅ Query successful');
    console.log('Database version:', result.rows[0].version);
    
    client.release();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.message.includes('timeout')) {
      console.error('\nPossible causes:');
      console.error('1. Firewall rules not configured for your IP');
      console.error('2. Network connectivity issues');
      console.error('3. Database server is not accepting connections');
      console.error('\nSuggested actions:');
      console.error('1. Verify your IP is allowed in Azure PostgreSQL firewall rules');
      console.error('2. Check if the database server is running');
      console.error('3. Verify the connection string is correct');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }

  console.log('\nAll tests completed successfully.');
}

// Run test
testDatabaseConnection().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});