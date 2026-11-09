import { useState } from 'react';

const TEXT = { idle: '삭제', confirming: '정말 삭제', deleting: '삭제 중', failed: '실패, 다시 삭제' };

// 실수로 지우지 않도록 두 번 눌러야 삭제된다.
export default function DeleteButton({ onDelete, label }) {
  const [step, setStep] = useState('idle'); // idle | confirming | deleting | failed

  const handleClick = async () => {
    if (step === 'idle') {
      setStep('confirming');
      return;
    }

    setStep('deleting');
    try {
      await onDelete();
    } catch {
      setStep('failed');
    }
  };

  const tone = step === 'idle' ? 'text-muted hover:bg-surface hover:text-ink' : 'bg-danger-soft text-danger';

  return (
    <button
      type="button"
      className={`min-h-9 whitespace-nowrap rounded-lg px-2.5 text-[0.8rem] font-semibold transition ${tone}`}
      aria-label={`${label} ${TEXT[step]}`}
      disabled={step === 'deleting'}
      onClick={handleClick}
      onBlur={() => step === 'confirming' && setStep('idle')}
    >
      {TEXT[step]}
    </button>
  );
}
