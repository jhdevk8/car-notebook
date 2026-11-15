import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import FormStatus from '../../components/ui/FormStatus.jsx';
import { BrandMark } from '../../components/ui/Icon.jsx';
import Panel from '../../components/ui/Panel.jsx';
import { useForm } from '../../hooks/useForm.js';
import { updatePassword } from '../../services/authService.js';

// 재설정 링크로 들어왔을 때 새 비밀번호를 정하는 화면.
export default function NewPasswordPage({ onDone }) {
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

  return (
    <div className="page-gutter grid min-h-dvh place-items-center py-12">
      <Panel as="form" className="w-full max-w-[400px]" onSubmit={form.handleSubmit}>
        <div className="flex flex-col gap-3">
          <BrandMark />
          <h1>{isDone ? '비밀번호를 바꿨어요' : '새 비밀번호 정하기'}</h1>
        </div>

        {isDone ? (
          <>
            <p className="text-[0.92rem] text-muted">
              이 화면은 닫아도 돼요. 설치한 앱에서 이메일과 새 비밀번호로 로그인해 주세요.
            </p>
            <Button variant="primary" onClick={onDone}>
              여기서 계속 쓰기
            </Button>
          </>
        ) : (
          <>
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
          </>
        )}
      </Panel>
    </div>
  );
}
