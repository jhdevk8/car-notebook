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
      <ol className="ml-1.5 flex flex-col">
        {items.map((item) => (
          <li
            key={item.id}
            className="relative grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 border-l-2 border-line pb-4 pl-5 tabular-nums last:border-l-transparent last:pb-0"
          >
            <span className="absolute top-1 -left-[7px] size-3 rounded-full border-2 border-surface bg-accent" />
            <span className="font-semibold wrap-anywhere">{item.product}</span>
            <span className="text-muted">{formatKm(item.km)}</span>
            <span className="col-span-2 text-[0.85rem] text-muted">{formatDate(item.date)}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
