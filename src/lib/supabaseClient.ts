import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

class SupabaseClient {
  private static instance: ReturnType<typeof createClient<Database>>;
  private static connectionPromise: Promise<ReturnType<typeof createClient<Database>>> | null = null;
  private static retryCount = 0;
  private static readonly MAX_RETRIES = 5;
  private static readonly INITIAL_RETRY_DELAY = 1000;

  private static async createInstance() {
    const client = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: { 'apikey': supabaseKey }
      }
    });

    // Test the connection
    const { error } = await client.from('timelines').select('count').limit(1).single();
    if (error) throw error;

    return client;
  }

  static async getInstance() {
    if (!this.connectionPromise) {
      this.connectionPromise = this.initializeWithRetry();
    }
    return this.connectionPromise;
  }

  private static async initializeWithRetry(): Promise<ReturnType<typeof createClient<Database>>> {
    try {
      if (!this.instance) {
        this.instance = await this.createInstance();
        this.retryCount = 0; // Reset retry count on success
      }
      return this.instance;
    } catch (error) {
      console.error('Supabase connection error:', error);
      
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        const delay = this.INITIAL_RETRY_DELAY * Math.pow(2, this.retryCount - 1);
        console.log(`Retrying connection in ${delay}ms (attempt ${this.retryCount}/${this.MAX_RETRIES})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.initializeWithRetry();
      }
      
      throw new Error('Failed to initialize Supabase client after multiple attempts');
    }
  }

  static async resetConnection() {
    this.instance = null;
    this.connectionPromise = null;
    this.retryCount = 0;
    return this.getInstance();
  }
}

export const getSupabaseClient = () => SupabaseClient.getInstance();
export const resetSupabaseConnection = () => SupabaseClient.resetConnection();

// Initialize the connection immediately
getSupabaseClient().catch(console.error);