import { useState, useEffect, useCallback } from 'react';
import { 
  initializeSupabase, 
  resetSupabase, 
  getConnectionStatus,
  cleanupSupabase
} from '../lib/supabase';
import { SUPABASE_CONFIG } from '../lib/supabase/config';

export function useSupabaseConnection() {
  const [status, setStatus] = useState(getConnectionStatus());
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      await initializeSupabase();
      setStatus(getConnectionStatus());
      setError(null);
    } catch (err) {
      setStatus('disconnected');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, []);

  const retry = useCallback(async () => {
    try {
      await resetSupabase();
      await checkConnection();
    } catch (err) {
      console.error('Failed to reset connection:', err);
    }
  }, [checkConnection]);

  useEffect(() => {
    checkConnection();
    
    const interval = setInterval(checkConnection, SUPABASE_CONFIG.REFRESH_INTERVAL);
    
    const handleOnline = () => retry();
    const handleOffline = () => setStatus('disconnected');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cleanupSupabase();
    };
  }, [checkConnection, retry]);

  return {
    isConnected: status === 'connected',
    isChecking: status === 'connecting',
    error,
    retry
  };
}