const BOX =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 font-semibold transition active:scale-[0.99] sm:min-h-11';

const VARIANTS = {
  default: `${BOX} border border-line bg-surface text-ink backdrop-blur-xl hover:border-accent hover:text-accent`,
  primary: `${BOX} bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-accent-fg shadow-[0_8px_20px_-8px_var(--accent)] hover:brightness-110`,
  text: 'text-left font-semibold text-accent underline-offset-4 hover:underline',
  dangerText: 'text-left font-semibold text-danger underline-offset-4 hover:underline',
};

const isBox = (variant) => variant === 'default' || variant === 'primary';

export default function Button({ variant = 'default', fullWidth = true, type = 'button', ...props }) {
  const width = isBox(variant) && fullWidth ? 'w-full' : '';
  return <button type={type} className={`${VARIANTS[variant]} ${width}`} {...props} />;
}
