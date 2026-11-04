export default function Panel({ as: Tag = 'section', className = '', ...props }) {
  return (
    <Tag
      className={`flex min-w-0 flex-col gap-4 rounded-md border border-line bg-surface p-4 sm:p-5 ${className}`}
      {...props}
    />
  );
}
