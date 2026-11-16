// 화면을 이루는 카드와 그 안에 자주 쓰는 작은 블록들

export default function Panel({ as: Tag = 'section', className = '', ...props }) {
  return (
    <Tag
      className={`flex min-w-0 flex-col gap-4 rounded-3xl border border-line bg-surface p-5 shadow-[0_8px_32px_-12px_rgb(60_40_150/0.18)] backdrop-blur-xl sm:p-6 ${className}`}
      {...props}
    />
  );
}

const LAYOUTS = {
  form: 'md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]',
  list: 'md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]',
  even: 'md:grid-cols-2',
};

// PC에서는 두 칸, 폰에서는 한 칸으로 쌓는다.
export function TwoColumn({ layout = 'form', children }) {
  return <div className={`grid grid-cols-1 items-start gap-5 ${LAYOUTS[layout]}`}>{children}</div>;
}

// items: [{ label, value }]
export function StatList({ items }) {
  return (
    <dl className="grid grid-cols-3 gap-2">
      {items.map(({ label, value }) => (
        <div key={label} className="min-w-0 rounded-2xl bg-surface-2 px-2.5 py-2.5 sm:px-3">
          <dt className="text-[0.72rem] font-medium text-muted">{label}</dt>
          <dd className="mt-0.5 text-[clamp(0.82rem,3.5vw,1rem)] font-bold tabular-nums break-keep wrap-anywhere">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyState({ children }) {
  return (
    <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-[0.9rem] text-muted">
      {children}
    </p>
  );
}

export function Callout({ children }) {
  return <p className="rounded-2xl bg-accent-soft px-3.5 py-3 text-[0.9rem]">{children}</p>;
}

// 불러오는 중이나 오류처럼 화면 전체에 띄우는 문구
export function StatusMessage({ children, ...props }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-16 text-center text-muted" {...props}>
      {children}
    </div>
  );
}
