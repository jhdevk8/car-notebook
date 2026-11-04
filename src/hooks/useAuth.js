import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getSession, onSessionChange } from '../services/authService.js';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    getSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setIsLoading(false));

    return onSessionChange(setSession);
  }, []);

  return { userId: session?.user?.id ?? null, isLoading };
}
