// items: [{ label, value }]
export default function StatList({ items }) {
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
