const CONTROL =
  'min-h-12 w-full rounded-2xl border border-line bg-surface-2 px-3.5 py-2.5 text-base font-normal text-ink transition placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:ring-3 focus:ring-accent/20 focus:outline-none';

// 라벨과 입력칸 묶음. as="select"로 선택 상자도 만들 수 있다.
export default function Field({ id, label, as: Control = 'input', children, ...controlProps }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-[0.82rem] font-semibold text-muted" htmlFor={id}>
      {label}
      <Control id={id} className={CONTROL} {...controlProps}>
        {children}
      </Control>
    </label>
  );
}

// 입력칸 두 개를 PC에서는 나란히, 폰에서는 위아래로 놓는다.
export function FieldRow({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">{children}</div>;
}

// 폼 제출 결과 문구. 오류가 있으면 오류를 먼저 보여 준다.
export function FormStatus({ error, message }) {
  if (error) {
    return (
      <p className="text-[0.9rem] text-danger" role="alert">
        {error}
      </p>
    );
  }

  if (message) {
    return (
      <p className="text-[0.9rem] text-success" role="status">
        {message}
      </p>
    );
  }

  return null;
}
