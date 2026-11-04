// 라벨과 입력칸 묶음. as="select"로 선택 상자도 만들 수 있다.
export default function Field({ id, label, as: Control = 'input', children, ...controlProps }) {
  return (
    <label className="field" htmlFor={id}>
      {label}
      <Control id={id} {...controlProps}>
        {children}
      </Control>
    </label>
  );
}
