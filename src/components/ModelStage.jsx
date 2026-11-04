// 3D 모델이 들어갈 자리. 사용할 도구를 정하면 이 컴포넌트 안만 바꾸면 된다.
function CarOutline() {
  return (
    <svg
      className="w-[min(78%,420px)] fill-none stroke-ink stroke-[1.5] [stroke-linejoin:round]"
      viewBox="0 0 320 110"
      aria-hidden="true"
    >
      <path d="M12 82 V68 C12 60 20 56 34 54 L78 48 L116 22 C122 18 130 16 138 16 H198 C208 16 216 19 224 25 L254 48 L294 56 C304 58 308 64 308 72 V82 H276 M222 82 H98 M44 82 H12" />
      <path d="M92 48 L122 28 C126 25 132 24 138 24 H164 V48 Z M172 24 H198 C206 24 212 26 218 31 L238 48 H172 Z" />
      <circle cx="71" cy="82" r="24" />
      <circle cx="71" cy="82" r="10" />
      <circle cx="249" cy="82" r="24" />
      <circle cx="249" cy="82" r="10" />
    </svg>
  );
}

const SIZES = {
  home: 'h-[clamp(220px,42vh,360px)] sm:h-[clamp(280px,52vh,500px)]',
  detail: 'h-[clamp(240px,38vh,360px)]',
};

export default function ModelStage({ title, showCar = false, size = 'detail' }) {
  return (
    <div
      className={`flex max-w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-md border border-dashed border-line bg-stage p-5 text-center ${SIZES[size]}`}
    >
      {showCar ? <CarOutline /> : <strong className="text-[clamp(1.6rem,5vw,2.4rem)]">{title}</strong>}
      <p className="text-[0.85rem] font-medium text-muted">{title} 3D 모델 자리</p>
    </div>
  );
}
