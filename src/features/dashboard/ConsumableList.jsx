import { formatDate } from '../../utils/format.js';

export default function ConsumableList({ groups, selectedType, onSelect }) {
  return (
    <ul className="consumable-list">
      {groups.map(({ type, count, last }) => (
        <li key={type}>
          <button
            type="button"
            className="consumable-row"
            aria-pressed={type === selectedType}
            onClick={() => onSelect(type)}
          >
            <span className="consumable-name">{type}</span>
            <span className="consumable-date">{formatDate(last.date)}</span>
            <span className="consumable-count">{count}회</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
