import Panel from '../components/ui/Panel.jsx';
import BackupExport from '../features/backup/BackupExport.jsx';
import BackupRestore from '../features/backup/BackupRestore.jsx';

export default function BackupPage({ data, onRestore }) {
  return (
    <div className="split split-even">
      <Panel>
        <h1>백업 내려받기</h1>
        <p className="side-detail">
          주행거리 {data.logs.length}건과 교체 {data.replacements.length}건을 JSON 파일로 저장해요. 파일은 클라우드
          드라이브처럼 다른 곳에도 보관해 두세요.
        </p>
        <BackupExport data={data} />
      </Panel>
      <Panel>
        <h2>백업에서 복원</h2>
        <p className="side-detail">현재 기록을 지우지 않고 백업 내용을 합쳐요.</p>
        <BackupRestore onRestore={onRestore} />
      </Panel>
    </div>
  );
}
