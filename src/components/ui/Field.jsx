const CONTROL =
  'min-h-[42px] w-full rounded border border-line bg-bg px-2.5 py-2 text-base font-normal focus:border-accent focus:outline-1 focus:outline-accent';

// 라벨과 입력칸 묶음. as="select"로 선택 상자도 만들 수 있다.
export default function Field({ id, label, as: Control = 'input', children, ...controlProps }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-[0.88rem] font-medium" htmlFor={id}>
      {label}
      <Control id={id} className={CONTROL} {...controlProps}>
        {children}
      </Control>
    </label>
  );
}
