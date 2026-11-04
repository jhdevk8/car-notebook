import Panel from '../components/ui/Panel.jsx';
import ReplacementForm from '../features/replacements/ReplacementForm.jsx';
import ReplacementList from '../features/replacements/ReplacementList.jsx';

export default function ReplacementsPage({ replacements, onAdd, onDelete }) {
  return (
    <div className="split">
      <Panel>
        <h1>소모품 교체 기록</h1>
        <ReplacementForm onAdd={onAdd} />
      </Panel>
      <Panel>
        <h2>교체 내역 {replacements.length}건</h2>
        <ReplacementList replacements={replacements} onDelete={onDelete} />
      </Panel>
    </div>
  );
}
