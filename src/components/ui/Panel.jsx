export default function Panel({ as: Tag = 'section', className = '', ...props }) {
  return <Tag className={`panel ${className}`.trim()} {...props} />;
}
