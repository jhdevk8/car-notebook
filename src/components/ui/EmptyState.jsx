export default function EmptyState({ children }) {
  return (
    <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-[0.9rem] text-muted">
      {children}
    </p>
  );
}
