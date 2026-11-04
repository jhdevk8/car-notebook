const LAYOUTS = {
  form: 'md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]',
  list: 'md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]',
  even: 'md:grid-cols-2',
};

// PC에서는 두 칸, 폰에서는 한 칸으로 쌓는다.
export default function TwoColumn({ layout = 'form', children }) {
  return <div className={`grid grid-cols-1 items-start gap-5 ${LAYOUTS[layout]}`}>{children}</div>;
}
