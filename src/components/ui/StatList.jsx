// items: [{ label, value }]
export default function StatList({ items }) {
  return (
    <dl className="grid grid-cols-3 gap-3 border-t border-line pt-3.5 first:border-t-0 first:pt-0">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt className="text-[0.8rem] text-muted">{label}</dt>
          <dd className="text-[1.05rem] font-bold tabular-nums wrap-anywhere">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
