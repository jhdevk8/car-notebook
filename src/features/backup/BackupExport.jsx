import Button from '../../components/ui/Button.jsx';
import { buildBackup, getBackupFileName } from '../../utils/backup.js';
import { today } from '../../utils/format.js';

const downloadJson = (content, fileName) => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

export default function BackupExport({ data }) {
  return (
    <Button variant="primary" onClick={() => downloadJson(buildBackup(data), getBackupFileName(today()))}>
      백업 파일 내려받기
    </Button>
  );
}
