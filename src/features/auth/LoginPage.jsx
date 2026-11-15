import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import FormStatus from '../../components/ui/FormStatus.jsx';
import { BrandMark } from '../../components/ui/Icon.jsx';
import Panel from '../../components/ui/Panel.jsx';
import { SIGNUP_ENABLED } from '../../config/auth.js';
import { useForm } from '../../hooks/useForm.js';
import { signIn, signUp } from '../../services/authService.js';
import ResetPasswordForm from './ResetPasswordForm.jsx';

const createInitialValues = () => ({ email: '', password: '' });

export default function LoginPage({ onBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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

  if (isResetting) {
    return (
      <div className="page-gutter grid min-h-dvh place-items-center py-12">
        <Panel className="w-full max-w-[400px]">
          <div className="flex flex-col gap-3">
            <BrandMark />
            <h1>비밀번호 재설정</h1>
          </div>
          <ResetPasswordForm onCancel={() => setIsResetting(false)} />
        </Panel>
      </div>
    );
  }

  return (
    <div className="page-gutter grid min-h-dvh place-items-center py-12">
      <Panel as="form" className="w-full max-w-[400px]" onSubmit={form.handleSubmit}>
        <div className="flex flex-col gap-3">
          <BrandMark />
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
          {!isSignUp && (
            <Button variant="text" onClick={() => setIsResetting(true)}>
              비밀번호를 잊었어요
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
