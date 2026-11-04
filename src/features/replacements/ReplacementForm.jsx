import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import FieldRow from '../../components/ui/FieldRow.jsx';
import FormStatus from '../../components/ui/FormStatus.jsx';
import { CONSUMABLE_TYPES } from '../../data/consumables.js';
import { useForm } from '../../hooks/useForm.js';
import { today } from '../../utils/format.js';

const createInitialValues = () => ({
  type: CONSUMABLE_TYPES[0],
  product: '',
  date: today(),
  km: '',
  memo: '',
});

export default function ReplacementForm({ onAdd }) {
  const form = useForm({
    initialValues: createInitialValues,
    onSubmit: async (values) => {
      await onAdd({
        ...values,
        product: values.product.trim(),
        memo: values.memo.trim(),
        km: Number(values.km),
      });
      return `${values.type} 교체를 기록했어요.`;
    },
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit}>
      <Field id="replacementType" label="소모품 종류" as="select" {...form.bind('type')}>
        {CONSUMABLE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Field>
      <Field
        id="replacementProduct"
        label="제품명"
        type="text"
        placeholder="예: 보쉬 에어컨필터"
        required
        {...form.bind('product')}
      />
      <FieldRow>
        <Field id="replacementDate" label="교체일" type="date" required {...form.bind('date')} />
        <Field
          id="replacementKm"
          label="교체 시 주행거리 (km)"
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="157000"
          required
          {...form.bind('km')}
        />
      </FieldRow>
      <Field
        id="replacementMemo"
        label="메모 (선택)"
        type="text"
        placeholder="예: 공임 포함 3만원"
        {...form.bind('memo')}
      />

      <Button type="submit" variant="primary" disabled={form.isSubmitting}>
        {form.isSubmitting ? '저장 중…' : '교체 기록 저장'}
      </Button>
      <FormStatus error={form.error} message={form.message} />
    </form>
  );
}
