import { Component, lazy, Suspense } from 'react';

// 3D 라이브러리는 용량이 커서 홈에서 필요할 때만 불러온다.
const CarScene = lazy(() => import('./car/CarScene.jsx'));

// 3D를 불러오는 동안이나 실패했을 때 보여 줄 차 그림
function CarOutline() {
  return (
    <svg
      className="w-[min(80%,440px)] fill-none stroke-ink stroke-[1.5] [stroke-linejoin:round]"
      viewBox="0 0 320 116"
      aria-hidden="true"
    >
      <ellipse cx="160" cy="111" rx="146" ry="3.5" fill="currentColor" stroke="none" opacity="0.12" />
      <path d="M12 82 V68 C12 60 20 56 34 54 L78 48 L116 22 C122 18 130 16 138 16 H198 C208 16 216 19 224 25 L254 48 L294 56 C304 58 308 64 308 72 V82 H276 M222 82 H98 M44 82 H12" />
      <path d="M92 48 L122 28 C126 25 132 24 138 24 H164 V48 Z M172 24 H198 C206 24 212 26 218 31 L238 48 H172 Z" />
      <circle cx="71" cy="82" r="24" />
      <circle cx="71" cy="82" r="10" />
      <circle cx="249" cy="82" r="24" />
      <circle cx="249" cy="82" r="10" />
    </svg>
  );
}

// WebGL을 쓸 수 없는 기기에서는 3D 대신 그림을 보여 준다.
class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const GLOW =
  'bg-[radial-gradient(45%_55%_at_32%_45%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent),radial-gradient(45%_55%_at_70%_62%,color-mix(in_oklab,var(--accent-2)_20%,transparent),transparent)]';

const SIZES = {
  home: 'h-[clamp(240px,40vh,360px)] sm:h-[clamp(300px,46vh,440px)]',
  detail: 'h-[clamp(190px,28vh,280px)] rounded-3xl border border-line',
};

const CENTER = 'absolute inset-0 flex items-center justify-center';

export default function ModelStage({ title, showCar = false, size = 'detail' }) {
  if (showCar) {
    const fallback = (
      <div className={CENTER}>
        <CarOutline />
      </div>
    );

    return (
      <div className={`relative max-w-full overflow-hidden text-ink ${GLOW} ${SIZES[size]}`}>
        <SceneBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <div className="absolute inset-0">
              <CarScene />
            </div>
          </Suspense>
        </SceneBoundary>
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1 text-[0.75rem] font-medium text-muted backdrop-blur-xl">
          끌어서 돌려 보고, 꾹 눌러 보세요
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex max-w-full flex-col items-center justify-center gap-4 overflow-hidden p-5 text-center text-ink ${GLOW} ${SIZES[size]}`}
    >
      <strong className="text-[clamp(1.6rem,5vw,2.2rem)] font-bold">{title}</strong>
      <span className="rounded-full border border-line bg-surface/80 px-2.5 py-1 text-[0.75rem] font-medium text-muted">
        3D 모델 자리
      </span>
    </div>
  );
}
