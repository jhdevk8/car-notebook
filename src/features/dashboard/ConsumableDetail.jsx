import ModelStage from '../../components/ModelStage.jsx';
import Panel from '../../components/ui/Panel.jsx';
import StatList from '../../components/ui/StatList.jsx';
import { formatDate, formatKm } from '../../utils/format.js';

export default function ConsumableDetail({ group, currentKm }) {
  const { type, count, last, items } = group;

  return (
    <Panel className="consumable-detail" aria-label={`${type} 상세`}>
      <ModelStage title={type} className="stage-detail" />

      <StatList
        items={[
          { label: '교체 횟수', value: `${count}회` },
          { label: '마지막 교체', value: formatDate(last.date) },
          { label: '교체 후 주행', value: formatKm(currentKm - last.km) },
        ]}
      />

      <h2>교체 이력</h2>
      <ol className="timeline">
        {items.map((item) => (
          <li key={item.id}>
            <span className="timeline-date">{formatDate(item.date)}</span>
            <span>{item.product}</span>
            <span className="timeline-km">{formatKm(item.km)}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
