import { useCallback, useEffect, useRef, useState } from 'react';
import { validateLog } from '../utils/mileage.js';

// 기록 불러오기, 추가, 삭제를 담당한다. 어떤 저장소를 쓰는지는 신경 쓰지 않는다.
export function useCarRecords(repository) {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [syncError, setSyncError] = useState('');

  // 저장 직후 도착한 오래된 조회 결과가 새 기록을 덮어쓰지 않게 한다.
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    latestRequest.current += 1;
    const request = latestRequest.current;

    try {
      const loaded = await repository.load();
      if (request !== latestRequest.current) return;
      setData(loaded);
      setLoadError('');
      setSyncError('');
    } catch (error) {
      if (request !== latestRequest.current) return;
      // 이미 보이는 기록은 그대로 두고 알림만 띄운다.
      setSyncError(error.message);
      setLoadError(error.message);
    }
  }, [repository]);

  // 다른 기기에서 넣은 기록이 보이도록 탭으로 돌아올 때 다시 불러온다.
  useEffect(() => {
    refresh();

    const handleVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    document.addEventListener('visibilitychange', handleVisible);
    window.addEventListener('online', refresh);
    return () => {
      document.removeEventListener('visibilitychange', handleVisible);
      window.removeEventListener('online', refresh);
    };
  }, [refresh]);

  const write = async (action, applyToState) => {
    latestRequest.current += 1;
    const result = await action();
    setData((prev) => applyToState(prev, result));
    return result;
  };

  const saveVehicle = (name) =>
    write(
      () => repository.saveVehicle(name),
      (prev, vehicle) => ({ ...prev, vehicle })
    );

  const addLog = (log) => {
    const message = validateLog(data.logs, log);
    if (message) throw new Error(message);

    return write(
      () => repository.addLog(log),
      (prev, saved) => ({ ...prev, logs: [...prev.logs, saved] })
    );
  };

  const deleteLog = (id) =>
    write(
      () => repository.deleteLog(id),
      (prev) => ({ ...prev, logs: prev.logs.filter((log) => log.id !== id) })
    );

  const addReplacement = (item) =>
    write(
      () => repository.addReplacement(item),
      (prev, saved) => ({ ...prev, replacements: [...prev.replacements, saved] })
    );

  const deleteReplacement = (id) =>
    write(
      () => repository.deleteReplacement(id),
      (prev) => ({ ...prev, replacements: prev.replacements.filter((item) => item.id !== id) })
    );

  const restore = async (backup) => {
    await repository.restore(backup);
    await refresh();
  };

  return {
    data,
    loadError,
    syncError,
    refresh,
    saveVehicle,
    addLog,
    deleteLog,
    addReplacement,
    deleteReplacement,
    restore,
  };
}
