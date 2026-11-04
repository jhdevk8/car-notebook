import DeleteButton from '../../components/ui/DeleteButton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatDate, formatKm } from '../../utils/format.js';
import { sortByLatest } from '../../utils/replacements.js';

export default function ReplacementList({ replacements, onDelete }) {
  if (replacements.length === 0) {
    return <EmptyState>첫 교체 기록을 입력해 보세요.</EmptyState>;
  }

  return (
    <ul>
      {sortByLatest(replacements).map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-1 border-t border-line py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
        >
          <div className="flex min-w-0 flex-col">
            <strong>{item.type}</strong>
            <span>{item.product}</span>
            {item.memo && <span className="text-[0.85rem] text-muted">{item.memo}</span>}
          </div>
          <div className="col-start-1 flex gap-2.5 text-[0.88rem] text-muted tabular-nums sm:col-auto sm:flex-col sm:gap-0 sm:text-right">
            <span>{formatDate(item.date)}</span>
            <span>{formatKm(item.km)}</span>
          </div>
          <div className="col-start-2 row-span-2 row-start-1 sm:col-auto sm:row-auto">
            <DeleteButton label={`${item.type} 기록`} onDelete={() => onDelete(item.id)} />
          </div>
        </li>
      ))}
    </ul>
  );
}
