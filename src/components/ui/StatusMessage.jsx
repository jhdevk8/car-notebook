// 불러오는 중이나 오류처럼 화면 전체에 띄우는 문구
export default function StatusMessage({ children, ...props }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-16 text-center text-muted" {...props}>
      {children}
    </div>
  );
}
