import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import FormStatus from '../../components/ui/FormStatus.jsx';
import { parseBackup } from '../../utils/backup.js';

export default function BackupRestore({ onRestore }) {
  const [backup, setBackup] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleFile = async ({ target }) => {
    setBackup(null);
    setError('');
    setMessage('');
    if (!target.files[0]) return;

    try {
      setBackup(parseBackup(await target.files[0].text()));
    } catch (parseError) {
      setError(parseError.message);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setError('');
    try {
      await onRestore(backup);
      setBackup(null);
      setMessage('백업을 현재 기록에 합쳤어요.');
    } catch (restoreError) {
      setError(restoreError.message);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="form-stack">
      <Field id="backupFile" label="백업 파일 선택" type="file" accept="application/json,.json" onChange={handleFile} />
      {backup && (
        <>
          <p className="calc-preview">
            주행거리 {backup.logs.length}건, 교체 {backup.replacements.length}건을 합칩니다. 같은 날짜의 주행거리는
            지금 기록을 유지하고, 같은 교체 기록은 백업 내용으로 되돌려요.
          </p>
          <Button onClick={handleRestore} disabled={isRestoring}>
            {isRestoring ? '복원 중…' : '복원하기'}
          </Button>
        </>
      )}
      <FormStatus error={error} message={message} />
    </div>
  );
}
