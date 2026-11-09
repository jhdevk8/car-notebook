import { formatDate } from '../../utils/format.js';

export default function ConsumableList({ groups, selectedType, onSelect }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {groups.map(({ type, count, last }) => (
        <li key={type}>
          <button
            type="button"
            className="grid min-h-14 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-2xl px-3.5 py-2.5 text-left transition hover:bg-surface-2 aria-pressed:bg-accent-soft aria-pressed:ring-1 aria-pressed:ring-accent/40"
            aria-pressed={type === selectedType}
            onClick={() => onSelect(type)}
          >
            <span className="flex min-w-0 flex-col">
              <span className="font-bold">{type}</span>
              <span className="text-[0.8rem] text-muted tabular-nums">최근 {formatDate(last.date)}</span>
            </span>
            <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-[0.9rem] font-bold tabular-nums">
              {count}회
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
