// 실제 계기판 적산계처럼 숫자를 칸마다 나눠 보여 준다. 마지막 칸만 색을 다르게 한다.
export default function Odometer({ km }) {
  const digits = String(Math.round(km)).padStart(6, '0').split('');

  return (
    <div className="odometer" role="img" aria-label={`현재 주행거리 ${km.toLocaleString('ko-KR')}킬로미터`}>
      {digits.map((digit, index) => (
        <span key={index} className={index === digits.length - 1 ? 'digit digit-last' : 'digit'}>
          {digit}
        </span>
      ))}
      <span className="odometer-unit">km</span>
    </div>
  );
}
