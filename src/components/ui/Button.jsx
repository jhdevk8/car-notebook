const VARIANT_CLASS = {
  default: 'button',
  primary: 'button button-primary',
  text: 'text-button',
};

export default function Button({ variant = 'default', type = 'button', className = '', ...props }) {
  return <button type={type} className={`${VARIANT_CLASS[variant]} ${className}`.trim()} {...props} />;
}
