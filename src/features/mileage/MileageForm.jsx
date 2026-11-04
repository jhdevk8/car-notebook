import Button from '../../components/ui/Button.jsx';
import Callout from '../../components/ui/Callout.jsx';
import Field from '../../components/ui/Field.jsx';
import FieldRow from '../../components/ui/FieldRow.jsx';
import FormStatus from '../../components/ui/FormStatus.jsx';
import { useForm } from '../../hooks/useForm.js';
import { formatDate, formatKm, today } from '../../utils/format.js';
import { calcInterval, findPreviousLog } from '../../utils/mileage.js';

const createInitialValues = () => ({ date: today(), km: '' });

export default function MileageForm({ logs, onAdd }) {
  const form = useForm({
    initialValues: createInitialValues,
    onSubmit: async ({ date, km }) => {
      await onAdd({ date, km: Number(km) });
      return '주행거리를 저장했어요.';
    },
  });

  // 입력하는 동안 직전 기록과 비교한 결과를 바로 보여 준다.
  const { date, km } = form.values;
  const previous = date ? findPreviousLog(logs, date) : null;
  const preview = previous && km !== '' ? calcInterval(previous, { date, km: Number(km) }) : null;

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit}>
      <FieldRow>
        <Field id="logDate" label="날짜" type="date" required {...form.bind('date')} />
        <Field
          id="logKm"
          label="계기판 주행거리 (km)"
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="157000"
          required
          {...form.bind('km')}
        />
      </FieldRow>

      {preview && preview.km >= 0 && (
        <Callout>
          {formatDate(previous.date)} 기록과 비교하면{' '}
          <strong>
            {preview.days}일 동안 {formatKm(preview.km)}
          </strong>{' '}
          · 하루 평균 {formatKm(preview.perDay)}
        </Callout>
      )}

      <Button type="submit" variant="primary" disabled={form.isSubmitting}>
        {form.isSubmitting ? '저장 중…' : '기록 저장'}
      </Button>
      <FormStatus error={form.error} message={form.message} />
    </form>
  );
}
