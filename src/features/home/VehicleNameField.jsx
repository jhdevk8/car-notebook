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
    <label className="flex flex-col gap-1" htmlFor="vehicleName">
      <span className="self-start bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] bg-clip-text text-[0.75rem] font-bold tracking-[0.12em] text-transparent">MY CAR</span>
      <input
        id="vehicleName"
        className="w-full rounded-lg border border-transparent bg-transparent py-0.5 text-[1.6rem] leading-tight font-bold placeholder:text-muted/60 hover:border-line focus:border-accent focus:outline-none sm:text-[1.9rem]"
        type="text"
        value={draft}
        placeholder="차종 입력 (예: 14년식 K5)"
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
