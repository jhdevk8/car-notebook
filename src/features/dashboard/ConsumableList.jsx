import { formatDate } from '../../utils/format.js';

export default function ConsumableList({ groups, selectedType, onSelect }) {
  return (
    <ul>
      {groups.map(({ type, count, last }) => (
        <li key={type}>
          <button
            type="button"
            className="grid min-h-14 w-full grid-cols-[minmax(0,1fr)_auto] gap-x-3 border-t border-line px-3 py-[11px] text-left hover:bg-bg aria-pressed:bg-accent-soft"
            aria-pressed={type === selectedType}
            onClick={() => onSelect(type)}
          >
            <span className="font-bold">{type}</span>
            <span className="row-start-2 text-[0.85rem] text-muted tabular-nums">{formatDate(last.date)}</span>
            <span className="col-start-2 row-span-2 row-start-1 self-center font-num text-[1.15rem] font-semibold">
              {count}회
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
