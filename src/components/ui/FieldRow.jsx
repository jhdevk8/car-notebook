// 입력칸 두 개를 PC에서는 나란히, 폰에서는 위아래로 놓는다.
export default function FieldRow({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">{children}</div>;
}
