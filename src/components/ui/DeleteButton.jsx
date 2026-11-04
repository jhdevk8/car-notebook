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

  const tone = step === 'idle' ? 'border-transparent text-muted hover:border-line' : 'border-danger text-danger';

  return (
    <button
      type="button"
      className={`min-h-10 whitespace-nowrap rounded-sm border px-2.5 py-[3px] text-[0.82rem] sm:min-h-0 sm:px-[7px] ${tone}`}
      aria-label={`${label} ${TEXT[step]}`}
      disabled={step === 'deleting'}
      onClick={handleClick}
      onBlur={() => step === 'confirming' && setStep('idle')}
    >
      {TEXT[step]}
    </button>
  );
}
