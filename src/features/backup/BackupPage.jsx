import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field, { FormStatus } from '../../components/ui/Field.jsx';
import Panel, { Callout, TwoColumn } from '../../components/ui/Panel.jsx';
import { buildBackup, getBackupFileName, parseBackup } from '../../utils/backup.js';
import { today } from '../../utils/format.js';

const HINT = 'text-[0.9rem] text-muted';

export default function BackupPage({ data, onRestore }) {
  return (
    <TwoColumn layout="even">
      <Panel>
        <h1>백업 내려받기</h1>
        <p className={HINT}>
          주행거리 {data.logs.length}건과 교체 {data.replacements.length}건을 JSON 파일로 저장해요. 파일은 클라우드
          드라이브처럼 다른 곳에도 보관해 두세요.
        </p>
        <Button variant="primary" onClick={() => downloadJson(buildBackup(data), getBackupFileName(today()))}>
          백업 파일 내려받기
        </Button>
      </Panel>
      <Panel>
        <h2>백업에서 복원</h2>
        <p className={HINT}>현재 기록을 지우지 않고 백업 내용을 합쳐요.</p>
        <BackupRestore onRestore={onRestore} />
      </Panel>
    </TwoColumn>
  );
}

const downloadJson = (content, fileName) => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

function BackupRestore({ onRestore }) {
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
    <div className="flex flex-col gap-4">
      <Field id="backupFile" label="백업 파일 선택" type="file" accept="application/json,.json" onChange={handleFile} />
      {backup && (
        <>
          <Callout>
            주행거리 {backup.logs.length}건, 교체 {backup.replacements.length}건을 합칩니다. 같은 날짜의 주행거리는
            지금 기록을 유지하고, 같은 교체 기록은 백업 내용으로 되돌려요.
          </Callout>
          <Button onClick={handleRestore} disabled={isRestoring}>
            {isRestoring ? '복원 중…' : '복원하기'}
          </Button>
        </>
      )}
      <FormStatus error={error} message={message} />
    </div>
  );
}
