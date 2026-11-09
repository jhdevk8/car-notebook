// 메뉴와 버튼에 쓰는 선 아이콘. 색은 글자색(currentColor)을 따른다.
const PATHS = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9v11.5h13V9" />
      <path d="M10 20.5v-6h4v6" />
    </>
  ),
  gauge: (
    <>
      <path d="M12 14.5 16 10" />
      <path d="M3.5 18.5a9.5 9.5 0 1 1 17 0" />
      <circle cx="12" cy="14.5" r="1" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="m8 15 3.5-3.5 3 3L20 9" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="5" rx="1.5" />
      <path d="M5 9v10.5h14V9" />
      <path d="M10 13h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  logout: (
    <>
      <path d="M9 20.5H5.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H9" />
      <path d="m15.5 16.5 4.5-4.5-4.5-4.5" />
      <path d="M20 12H9" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.8v.2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 21.5 20h-19z" />
      <path d="M12 10v4" />
      <path d="M12 17v.2" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
};

export default function Icon({ name, className = 'size-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

// 앱 이름 옆 작은 로고
export function BrandMark() {
  return (
    <span className="grid size-8 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-accent-fg shadow-[0_6px_16px_-6px_var(--accent)]">
      <Icon name="gauge" className="size-[18px]" />
    </span>
  );
}
