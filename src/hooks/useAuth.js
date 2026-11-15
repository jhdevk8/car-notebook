import { useEffect, useState } from 'react';
import { isSupabaseConfigured, openedFromRecoveryLink } from '../lib/supabaseClient.js';
import { getSession, onSessionChange } from '../services/authService.js';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  // 재설정 링크로 들어왔으면 새 비밀번호를 정할 때까지 그 화면을 보여 준다.
  const [isRecovering, setIsRecovering] = useState(isSupabaseConfigured && openedFromRecoveryLink);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    getSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setIsLoading(false));

    return onSessionChange(setSession);
  }, []);

  return {
    userId: session?.user?.id ?? null,
    isLoading,
    isRecovering,
    finishRecovery: () => setIsRecovering(false),
  };
}
