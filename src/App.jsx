import { useMemo } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import CarNotebook from './CarNotebook.jsx';
import { EMPTY_RECORDS } from './data/emptyRecords.js';
import LoginPage from './features/auth/LoginPage.jsx';
import { useAuth } from './hooks/useAuth.js';
import { isSupabaseConfigured, supabase } from './lib/supabaseClient.js';
import { createLocalRepository } from './repositories/localRepository.js';
import { createSupabaseRepository } from './repositories/supabaseRepository.js';
import { signOut } from './services/authService.js';

const GUEST_NOTICE = {
  id: 'guest',
  text: '이 브라우저에만 저장돼요. 백업을 받아 두세요.',
};

export default function App() {
  const navigate = useNavigate();
  const { userId, isLoading } = useAuth();

  const guestRepository = useMemo(() => createLocalRepository('car-notebook-guest', EMPTY_RECORDS), []);
  const accountRepository = useMemo(
    () => (userId ? createSupabaseRepository(supabase, userId) : null),
    [userId]
  );

  if (isLoading) return <p className="status-message">불러오는 중…</p>;

  const notebook = userId ? (
    <CarNotebook
      key={userId}
      repository={accountRepository}
      guestRepository={guestRepository}
      account={{ label: '로그아웃', onClick: signOut }}
    />
  ) : (
    <CarNotebook
      key="guest"
      repository={guestRepository}
      baseNotices={[GUEST_NOTICE]}
      account={isSupabaseConfigured ? { label: '로그인', onClick: () => navigate('/login') } : null}
    />
  );

  const canOpenLogin = isSupabaseConfigured && !userId;

  return (
    <Routes>
      <Route
        path="/login"
        element={canOpenLogin ? <LoginPage onBack={() => navigate('/')} /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={notebook} />
    </Routes>
  );
}
