import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import FormStatus from '../../components/ui/FormStatus.jsx';
import { useForm } from '../../hooks/useForm.js';
import { sendPasswordResetLink } from '../../services/authService.js';

// 가입한 이메일로 재설정 링크를 보낸다.
export default function ResetPasswordForm({ onCancel }) {
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
