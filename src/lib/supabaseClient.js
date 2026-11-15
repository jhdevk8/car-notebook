import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 비밀번호 재설정 링크로 들어왔는지. Supabase가 주소의 토큰을 지우기 전에 확인해 둔다.
export const openedFromRecoveryLink = /type=recovery/.test(window.location.hash);

export const isSupabaseConfigured = Boolean(url && publishableKey);

// .env.local이 없으면 null이고, 앱은 예시 모드로 실행된다.
export const supabase = isSupabaseConfigured ? createClient(url, publishableKey) : null;
