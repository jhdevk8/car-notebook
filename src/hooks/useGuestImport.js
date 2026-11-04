import { useEffect, useState } from 'react';

// 로그인 전에 이 브라우저에 쌓은 기록을 계정으로 옮기는 안내를 만든다.
// 저장에 성공한 뒤에만 브라우저 기록을 비운다.
export function useGuestImport(guestRepository, restore) {
  const [guestData, setGuestData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    guestRepository?.load().then(setGuestData);
  }, [guestRepository]);

  const count = guestData ? guestData.logs.length + guestData.replacements.length : 0;
  if (count === 0) return { notice: null };

  const handleImport = async () => {
    setIsImporting(true);
    setError('');
    try {
      await restore(guestData);
      await guestRepository.clear();
      setGuestData(null);
    } catch (importError) {
      setError(importError.message);
    } finally {
      setIsImporting(false);
    }
  };

  return {
    notice: {
      id: 'guest-import',
      tone: error ? 'error' : 'info',
      text: error
        ? `기록을 옮기지 못했어요. 이 브라우저의 기록은 그대로 있어요. ${error}`
        : `이 브라우저에 로그인 전 기록 ${count}건이 있어요.`,
      actionLabel: isImporting ? '옮기는 중…' : '내 계정으로 옮기기',
      onAction: isImporting ? undefined : handleImport,
    },
  };
}
