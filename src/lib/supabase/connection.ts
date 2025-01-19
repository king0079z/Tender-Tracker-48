import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';
import { SUPABASE_CONFIG, AUTH_CONFIG } from './config';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

class SupabaseConnection {
  private static instance = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  });

  private static isInitialized = false;
  private static initPromise: Promise<void> | null = null;
  private static connectionStatus: ConnectionStatus = 'disconnected';

  public static async initialize() {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.connectionStatus = 'connecting';
    this.initPromise = this.initializeConnection();
    return this.initPromise;
  }

  private static async initializeConnection() {
    try {
      const { data: { session }, error: sessionError } = await this.instance.auth.getSession();
      
      if (sessionError) throw sessionError;

      if (!session) {
        const { error: signInError } = await this.instance.auth.signInWithPassword(AUTH_CONFIG);
        if (signInError) throw signInError;
      }

      // Test connection
      const { error: testError } = await this.instance
        .from('timelines')
        .select('count')
        .limit(1)
        .single();

      if (testError) throw testError;

      this.isInitialized = true;
      this.connectionStatus = 'connected';
      this.initPromise = null;
    } catch (error) {
      this.isInitialized = false;
      this.connectionStatus = 'disconnected';
      this.initPromise = null;
      throw error;
    }
  }

  public static getInstance() {
    return this.instance;
  }

  public static getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  public static async reset() {
    this.isInitialized = false;
    this.connectionStatus = 'disconnected';
    this.initPromise = null;
    await this.instance.auth.signOut();
    return this.initialize();
  }

  public static cleanup() {
    this.isInitialized = false;
    this.connectionStatus = 'disconnected';
    this.initPromise = null;
  }
}

export const supabase = SupabaseConnection.getInstance();
export const initializeSupabase = () => SupabaseConnection.initialize();
export const resetSupabase = () => SupabaseConnection.reset();
export const getConnectionStatus = () => SupabaseConnection.getConnectionStatus();
export const cleanupSupabase = () => SupabaseConnection.cleanup();