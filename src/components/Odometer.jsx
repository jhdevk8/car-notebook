const DIGIT =
  'w-[clamp(32px,7vw,44px)] rounded-[3px] py-[5px] text-center text-[clamp(1.45rem,4.4vw,1.95rem)] leading-[1.25] font-semibold';

// 실제 계기판 적산계처럼 숫자를 칸마다 나눠 보여 준다. 마지막 칸만 색을 다르게 한다.
export default function Odometer({ km }) {
  const digits = String(Math.round(km)).padStart(6, '0').split('');

  return (
    <div
      className="flex flex-wrap items-end justify-center gap-[3px] font-num"
      role="img"
      aria-label={`현재 주행거리 ${km.toLocaleString('ko-KR')}킬로미터`}
    >
      {digits.map((digit, index) => {
        const color = index === digits.length - 1 ? 'bg-drum-last text-drum-last-fg' : 'bg-drum text-drum-fg';
        return (
          <span key={index} className={`${DIGIT} ${color}`}>
            {digit}
          </span>
        );
      })}
      <span className="ml-1.5 text-[0.9rem] font-medium text-muted">km</span>
    </div>
  );
}
