import ModelStage from '../../components/ModelStage.jsx';
import Panel from '../../components/ui/Panel.jsx';
import StatList from '../../components/ui/StatList.jsx';
import { formatDate, formatKm } from '../../utils/format.js';

export default function ConsumableDetail({ group, currentKm }) {
  const { type, count, last, items } = group;

  return (
    <Panel aria-label={`${type} 상세`}>
      <ModelStage title={type} />

      <StatList
        items={[
          { label: '교체 횟수', value: `${count}회` },
          { label: '마지막 교체', value: formatDate(last.date) },
          { label: '교체 후 주행', value: formatKm(currentKm - last.km) },
        ]}
      />

      <h2>교체 이력</h2>
      <ol>
        {items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3.5 gap-y-1 border-t border-line py-2.5 tabular-nums sm:grid-cols-[auto_minmax(0,1fr)_auto]"
          >
            <span className="text-muted">{formatDate(item.date)}</span>
            <span className="col-span-2 row-start-2 sm:col-auto sm:row-auto">{item.product}</span>
            <span className="text-muted">{formatKm(item.km)}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
