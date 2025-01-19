/**
 * Client-side API wrapper for database operations
 */
export class DatabaseAPI {
  private baseUrl: string;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;
  private connectionCheckInterval: number = 30000;
  private connectionCheckTimer: number | null = null;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();
  private isConnected: boolean = false;

  constructor() {
    this.baseUrl = '/api';
    this.startConnectionMonitoring();
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const result = await operation();
      this.retryCount = 0;
      return result;
    } catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = Math.min(this.retryDelay * Math.pow(2, this.retryCount - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryOperation(operation);
      }
      throw error;
    }
  }

  private startConnectionMonitoring() {
    this.checkConnection();
    this.connectionCheckTimer = window.setInterval(() => {
      this.checkConnection();
    }, this.connectionCheckInterval);
  }

  private async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      const isConnected = data.status === 'healthy' && data.database === 'connected';
      if (isConnected !== this.isConnected) {
        this.isConnected = isConnected;
        this.notifyListeners(isConnected);
      }
    } catch (error) {
      if (this.isConnected) {
        this.isConnected = false;
        this.notifyListeners(false);
      }
    }
  }

  public onConnectionChange(listener: (connected: boolean) => void) {
    this.connectionListeners.add(listener);
    // Immediately notify of current state
    listener(this.isConnected);
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  private notifyListeners(connected: boolean) {
    this.connectionListeners.forEach(listener => listener(connected));
  }

  public cleanup() {
    if (this.connectionCheckTimer) {
      window.clearInterval(this.connectionCheckTimer);
    }
    this.connectionListeners.clear();
  }

  async query(text: string, params?: any[]) {
    return this.retryOperation(async () => {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, params }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Query failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Database query failed');
      }

      return data;
    });
  }

  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return {
        isConnected: data.status === 'healthy' && data.database === 'connected',
        details: data
      };
    } catch (error) {
      return {
        isConnected: false,
        details: {
          error: error instanceof Error ? error.message : 'Connection test failed'
        }
      };
    }
  }
}