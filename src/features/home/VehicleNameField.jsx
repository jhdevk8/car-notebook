import { useEffect, useState } from 'react';

// 글자마다 저장하지 않고 입력칸에서 벗어날 때 한 번 저장한다.
export default function VehicleNameField({ value, onSave }) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState('');

  useEffect(() => setDraft(value), [value]);

  const handleBlur = async () => {
    const trimmed = draft.trim();
    if (trimmed === value) return;

    try {
      await onSave(trimmed);
      setError('');
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  return (
    <label className="flex flex-col items-center gap-0.5" htmlFor="vehicleName">
      <span className="text-[0.8rem] font-medium tracking-[0.04em] text-muted">내 차</span>
      <input
        id="vehicleName"
        className="w-full max-w-[420px] border-b border-transparent bg-transparent text-center text-[1.45rem] font-bold hover:border-line focus:border-line focus:outline-none"
        type="text"
        value={draft}
        placeholder="차종 입력 (예: 14년식 LPG K5)"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={handleBlur}
        onKeyDown={(event) => event.key === 'Enter' && event.target.blur()}
      />
      {error && (
        <span className="text-[0.9rem] text-danger" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
