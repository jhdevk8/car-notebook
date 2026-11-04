import { supabase } from '../lib/supabaseClient.js';

const AUTH_ERROR_MESSAGES = {
  invalid_credentials: '이메일 또는 비밀번호가 맞지 않아요.',
  email_not_confirmed: '메일의 확인 링크를 누른 뒤 로그인해 주세요.',
  user_already_exists: '이미 가입된 이메일이에요. 로그인해 주세요.',
  email_exists: '이미 가입된 이메일이에요. 로그인해 주세요.',
  weak_password: '비밀번호를 더 길고 복잡하게 만들어 주세요.',
  signup_disabled: '새 계정 만들기가 꺼져 있어요.',
  over_email_send_rate_limit: '메일을 너무 많이 보냈어요. 잠시 후 다시 시도해 주세요.',
};

const unwrap = ({ data, error }) => {
  if (error) {
    throw new Error(AUTH_ERROR_MESSAGES[error.code] ?? '로그인 처리에 실패했어요. 잠시 후 다시 시도해 주세요.');
  }
  return data;
};

export const getSession = async () => unwrap(await supabase.auth.getSession()).session;

export const onSessionChange = (callback) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
};

export const signIn = async ({ email, password }) => {
  unwrap(await supabase.auth.signInWithPassword({ email, password }));
};

// 메일 확인이 필요한 설정이면 session이 없다. 그때 true를 돌려준다.
export const signUp = async ({ email, password }) => {
  const { session } = unwrap(
    await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    })
  );
  return !session;
};

export const signOut = async () => {
  unwrap(await supabase.auth.signOut());
};
