import DeleteButton from '../../components/ui/DeleteButton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatDate, formatKm } from '../../utils/format.js';
import { sortByLatest } from '../../utils/replacements.js';

export default function ReplacementList({ replacements, onDelete }) {
  if (replacements.length === 0) {
    return <EmptyState>첫 교체 기록을 입력해 보세요.</EmptyState>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {sortByLatest(replacements).map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 rounded-2xl bg-surface-2 p-3.5"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="self-start rounded-full bg-accent-soft px-2 py-0.5 text-[0.75rem] font-semibold text-accent">
              {item.type}
            </span>
            <strong className="wrap-anywhere">{item.product}</strong>
            {item.memo && <span className="text-[0.85rem] text-muted">{item.memo}</span>}
          </div>
          <DeleteButton label={`${item.type} 기록`} onDelete={() => onDelete(item.id)} />
          <div className="col-span-2 flex gap-3 text-[0.85rem] text-muted tabular-nums">
            <span>{formatDate(item.date)}</span>
            <span>{formatKm(item.km)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
