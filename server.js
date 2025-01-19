import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compression from 'compression';
import pg from 'pg';
const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Enable gzip compression
app.use(compression());
app.use(express.json());

// Database connection management
let dbClient = null;
let isConnected = false;
let connectionRetries = 0;
const MAX_RETRIES = process.env.DB_MAX_RETRIES ? parseInt(process.env.DB_MAX_RETRIES, 10) : 5;
const RETRY_DELAY = process.env.DB_RETRY_DELAY ? parseInt(process.env.DB_RETRY_DELAY, 10) : 5000;

const createClient = () => {
  if (!process.env.AZURE_POSTGRESQL_CONNECTIONSTRING) {
    throw new Error('AZURE_POSTGRESQL_CONNECTIONSTRING environment variable is not set');
  }

  return new Client({
    connectionString: process.env.AZURE_POSTGRESQL_CONNECTIONSTRING,
    ssl: {
      rejectUnauthorized: false
    }
  });
};

const connectDB = async () => {
  if (isConnected) return true;

  try {
    if (dbClient) {
      await dbClient.end().catch(() => {});
    }

    dbClient = createClient();
    await dbClient.connect();
    isConnected = true;
    connectionRetries = 0;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    
    isConnected = false;
    dbClient = null;

    if (connectionRetries < MAX_RETRIES) {
      connectionRetries++;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDB();
    }
    return false;
  }
};

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: isConnected ? 'connected' : 'disconnected',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasConnectionString: !!process.env.AZURE_POSTGRESQL_CONNECTIONSTRING
      }
    };

    if (isConnected) {
      try {
        await dbClient.query('SELECT 1');
        health.database = 'connected';
      } catch (dbError) {
        health.database = 'error';
        health.databaseError = dbError.message;
        connectDB();
      }
    }

    res.status(200).json(health);
  } catch (error) {
    res.status(200).json({
      status: 'degraded',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database query endpoint
app.post('/api/query', async (req, res) => {
  if (!isConnected) {
    return res.status(503).json({
      error: true,
      message: 'Database not connected'
    });
  }

  try {
    const { text, params } = req.body;
    
    if (!text) {
      return res.status(400).json({
        error: true,
        message: 'Query text is required'
      });
    }

    const result = await dbClient.query(text, params);

    res.json({
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields?.map(f => ({
        name: f.name,
        dataType: f.dataTypeID
      }))
    });
  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === '57P01') {
      isConnected = false;
      connectDB();
    }
    
    res.status(500).json({ 
      error: true,
      message: error.message,
      code: error.code,
      detail: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Serve static files
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Graceful shutdown
const shutdown = async () => {
  if (dbClient) {
    try {
      await dbClient.end();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Initialize server
const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.log('Server started without database connection');
    }

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();