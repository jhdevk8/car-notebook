import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field, { FormStatus } from '../../components/ui/Field.jsx';
import { BrandMark } from '../../components/ui/Icon.jsx';
import Panel from '../../components/ui/Panel.jsx';
import { useForm } from '../../hooks/useForm.js';
import { sendPasswordResetLink, signIn, signUp, updatePassword } from '../../services/authService.js';

// 지금은 다른 사용자를 받지 않는다. 마이페이지에서 가입을 열 때 true로 바꾼다.
const SIGNUP_ENABLED = false;

const LINKS = 'flex flex-wrap justify-between gap-x-4 gap-y-2 text-[0.9rem]';

// 로그인 화면들이 같이 쓰는 가운데 카드
function AuthCard({ title, as, onSubmit, children }) {
  return (
    <div className="page-gutter grid min-h-dvh place-items-center py-12">
      <Panel as={as} className="w-full max-w-[400px]" onSubmit={onSubmit}>
        <div className="flex flex-col gap-3">
          <BrandMark />
          <h1>{title}</h1>
        </div>
        {children}
      </Panel>
    </div>
  );
}

export function LoginPage({ onBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const form = useForm({
    initialValues: () => ({ email: '', password: '' }),
    onSubmit: async ({ email, password }) => {
      const credentials = { email: email.trim(), password };

      if (!isSignUp) {
        await signIn(credentials);
        return '';
      }

      const needsConfirmation = await signUp(credentials);
      return needsConfirmation ? '메일의 확인 링크를 누른 뒤 로그인해 주세요.' : '';
    },
  });

  if (isResetting) {
    return (
      <AuthCard title="비밀번호 재설정">
        <ResetPasswordForm onCancel={() => setIsResetting(false)} />
      </AuthCard>
    );
  }

  return (
    <AuthCard title={isSignUp ? '계정 만들기' : '로그인'} as="form" onSubmit={form.handleSubmit}>
      <Field id="authEmail" label="이메일" type="email" autoComplete="email" required {...form.bind('email')} />
      <Field
        id="authPassword"
        label="비밀번호"
        type="password"
        minLength={6}
        autoComplete={isSignUp ? 'new-password' : 'current-password'}
        required
        {...form.bind('password')}
      />

      <Button type="submit" variant="primary" disabled={form.isSubmitting}>
        {form.isSubmitting ? '처리 중…' : isSignUp ? '계정 만들기' : '로그인'}
      </Button>
      <FormStatus error={form.error} message={form.message} />

      <div className={LINKS}>
        {SIGNUP_ENABLED && (
          <Button variant="text" onClick={() => setIsSignUp((prev) => !prev)}>
            {isSignUp ? '이미 계정이 있어요' : '계정 만들기'}
          </Button>
        )}
        {!isSignUp && (
          <Button variant="text" onClick={() => setIsResetting(true)}>
            비밀번호를 잊었어요
          </Button>
        )}
        <Button variant="text" onClick={onBack}>
          로그인 없이 계속 쓰기
        </Button>
      </div>
    </AuthCard>
  );
}

// 가입한 이메일로 재설정 링크를 보낸다.
function ResetPasswordForm({ onCancel }) {
  const form = useForm({
    initialValues: () => ({ email: '' }),
    onSubmit: async ({ email }) => {
      await sendPasswordResetLink(email.trim());
      return '메일을 보냈어요. 링크를 눌러 새 비밀번호를 정한 뒤, 여기서 로그인해 주세요.';
    },
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit}>
      <p className="text-[0.92rem] text-muted">가입한 이메일로 비밀번호 재설정 링크를 보내 드려요.</p>
      <Field id="resetEmail" label="이메일" type="email" autoComplete="email" required {...form.bind('email')} />
      <Button type="submit" variant="primary" disabled={form.isSubmitting}>
        {form.isSubmitting ? '보내는 중…' : '재설정 메일 받기'}
      </Button>
      <FormStatus error={form.error} message={form.message} />
      <Button variant="text" onClick={onCancel}>
        로그인으로 돌아가기
      </Button>
    </form>
  );
}

// 재설정 링크로 들어왔을 때 새 비밀번호를 정하는 화면
export function NewPasswordPage({ onDone }) {
  const [isDone, setIsDone] = useState(false);

  const form = useForm({
    initialValues: () => ({ password: '', confirm: '' }),
    onSubmit: async ({ password, confirm }) => {
      if (password !== confirm) throw new Error('두 비밀번호가 달라요.');
      await updatePassword(password);
      setIsDone(true);
      return '';
    },
  });

  if (isDone) {
    return (
      <AuthCard title="비밀번호를 바꿨어요">
        <p className="text-[0.92rem] text-muted">
          이 화면은 닫아도 돼요. 설치한 앱에서 이메일과 새 비밀번호로 로그인해 주세요.
        </p>
        <Button variant="primary" onClick={onDone}>
          여기서 계속 쓰기
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="새 비밀번호 정하기" as="form" onSubmit={form.handleSubmit}>
      <Field
        id="newPassword"
        label="새 비밀번호 (6자 이상)"
        type="password"
        minLength={6}
        autoComplete="new-password"
        required
        {...form.bind('password')}
      />
      <Field
        id="newPasswordConfirm"
        label="한 번 더 입력"
        type="password"
        minLength={6}
        autoComplete="new-password"
        required
        {...form.bind('confirm')}
      />
      <Button type="submit" variant="primary" disabled={form.isSubmitting}>
        {form.isSubmitting ? '저장 중…' : '비밀번호 저장'}
      </Button>
      <FormStatus error={form.error} message={form.message} />
    </AuthCard>
  );
}
