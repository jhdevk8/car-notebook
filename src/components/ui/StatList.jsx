// items: [{ label, value }]
export default function StatList({ items }) {
  return (
    <dl className="totals">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
