import DeleteButton from '../../components/ui/DeleteButton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatDate, formatKm } from '../../utils/format.js';
import { sortByLatest } from '../../utils/replacements.js';

export default function ReplacementList({ replacements, onDelete }) {
  if (replacements.length === 0) {
    return <EmptyState>첫 교체 기록을 입력해 보세요.</EmptyState>;
  }

  return (
    <ul className="record-list">
      {sortByLatest(replacements).map((item) => (
        <li key={item.id} className="record">
          <div className="record-main">
            <strong>{item.type}</strong>
            <span>{item.product}</span>
            {item.memo && <span className="record-memo">{item.memo}</span>}
          </div>
          <div className="record-meta">
            <span>{formatDate(item.date)}</span>
            <span>{formatKm(item.km)}</span>
          </div>
          <DeleteButton label={`${item.type} 기록`} onDelete={() => onDelete(item.id)} />
        </li>
      ))}
    </ul>
  );
}
