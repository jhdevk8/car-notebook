// 3D 모델이 들어갈 자리. 사용할 도구를 정하면 이 컴포넌트 안만 바꾸면 된다.
function CarOutline() {
  return (
    <svg className="stage-car" viewBox="0 0 320 110" aria-hidden="true">
      <path d="M12 82 V68 C12 60 20 56 34 54 L78 48 L116 22 C122 18 130 16 138 16 H198 C208 16 216 19 224 25 L254 48 L294 56 C304 58 308 64 308 72 V82 H276 M222 82 H98 M44 82 H12" />
      <path d="M92 48 L122 28 C126 25 132 24 138 24 H164 V48 Z M172 24 H198 C206 24 212 26 218 31 L238 48 H172 Z" />
      <circle cx="71" cy="82" r="24" />
      <circle cx="71" cy="82" r="10" />
      <circle cx="249" cy="82" r="24" />
      <circle cx="249" cy="82" r="10" />
    </svg>
  );
}

export default function ModelStage({ title, showCar = false, className = '' }) {
  return (
    <div className={`stage stage-empty ${className}`}>
      {showCar ? <CarOutline /> : <strong className="stage-title">{title}</strong>}
      <p className="stage-note">{title} 3D 모델 자리</p>
    </div>
  );
}
