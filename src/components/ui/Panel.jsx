export default function Panel({ as: Tag = 'section', className = '', ...props }) {
  return (
    <Tag
      className={`flex min-w-0 flex-col gap-4 rounded-3xl border border-line bg-surface p-5 shadow-[0_8px_32px_-12px_rgb(60_40_150/0.18)] backdrop-blur-xl sm:p-6 ${className}`}
      {...props}
    />
  );
}
