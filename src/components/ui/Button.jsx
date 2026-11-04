const BOX = 'min-h-12 rounded border px-3.5 py-2.5 font-medium sm:min-h-0';

const VARIANTS = {
  default: `${BOX} border-line bg-transparent hover:border-accent hover:text-accent`,
  primary: `${BOX} border-accent bg-accent text-accent-fg hover:brightness-110`,
  text: 'text-left font-medium text-accent underline underline-offset-3',
  dangerText: 'text-left font-medium text-danger underline underline-offset-3',
};

const isBox = (variant) => variant === 'default' || variant === 'primary';

export default function Button({ variant = 'default', fullWidth = true, type = 'button', ...props }) {
  const width = isBox(variant) && fullWidth ? 'w-full' : '';
  return <button type={type} className={`${VARIANTS[variant]} ${width}`} {...props} />;
}
