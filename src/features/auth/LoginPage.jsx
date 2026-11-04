import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import FormStatus from '../../components/ui/FormStatus.jsx';
import Panel from '../../components/ui/Panel.jsx';
import { SIGNUP_ENABLED } from '../../config/auth.js';
import { useForm } from '../../hooks/useForm.js';
import { signIn, signUp } from '../../services/authService.js';

const createInitialValues = () => ({ email: '', password: '' });

export default function LoginPage({ onBack }) {
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm({
    initialValues: createInitialValues,
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

  return (
    <div className="page-gutter grid place-items-center py-12">
      <Panel as="form" className="w-full max-w-[400px]" onSubmit={form.handleSubmit}>
        <div>
          <p className="text-[0.8rem] font-medium tracking-[0.04em] text-muted">내 차 수첩</p>
          <h1>{isSignUp ? '계정 만들기' : '로그인'}</h1>
        </div>

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

        <div className="flex flex-wrap justify-between gap-x-4 gap-y-2 text-[0.9rem]">
          {SIGNUP_ENABLED && (
            <Button variant="text" onClick={() => setIsSignUp((prev) => !prev)}>
              {isSignUp ? '이미 계정이 있어요' : '계정 만들기'}
            </Button>
          )}
          <Button variant="text" onClick={onBack}>
            로그인 없이 계속 쓰기
          </Button>
        </div>
      </Panel>
    </div>
  );
}
