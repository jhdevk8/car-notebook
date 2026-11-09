const DIGIT =
  'grid w-[clamp(30px,9vw,44px)] place-items-center rounded-md py-2 text-[clamp(1.5rem,6vw,2.1rem)] leading-none font-semibold';

// 드럼 질감: 위는 밝게, 아래는 어둡게
const DRUM_SHADE = 'bg-[linear-gradient(180deg,rgb(255_255_255/0.1),rgb(255_255_255/0.03)_50%,rgb(0_0_0/0.3))]';

// 실제 계기판 적산계처럼 숫자를 칸마다 나눠 보여 준다. 마지막 칸만 색을 다르게 한다.
export default function Odometer({ km }) {
  const digits = String(Math.round(km)).padStart(6, '0').split('');

  return (
    <div className="flex items-end gap-2" role="img" aria-label={`현재 주행거리 ${km.toLocaleString('ko-KR')}킬로미터`}>
      <div className="flex gap-1 rounded-xl bg-drum p-1.5 font-num shadow-[inset_0_2px_8px_rgb(0_0_0/0.5),0_10px_30px_-12px_var(--accent)]">
        {digits.map((digit, index) => {
          const color =
            index === digits.length - 1 ? 'bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-accent-fg' : `${DRUM_SHADE} text-drum-fg`;
          return (
            <span key={index} className={`${DIGIT} ${color}`}>
              {digit}
            </span>
          );
        })}
      </div>
      <span className="pb-1 text-[0.95rem] font-semibold text-muted">km</span>
    </div>
  );
}
