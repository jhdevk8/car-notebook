import TwoColumn from '../components/layout/TwoColumn.jsx';
import Panel from '../components/ui/Panel.jsx';
import StatList from '../components/ui/StatList.jsx';
import MileageForm from '../features/mileage/MileageForm.jsx';
import MileageTable from '../features/mileage/MileageTable.jsx';
import { formatKm } from '../utils/format.js';
import { getTotal } from '../utils/mileage.js';

export default function MileagePage({ logs, onAdd, onDelete }) {
  const total = getTotal(logs);

  return (
    <TwoColumn>
      <Panel>
        <h1>주행거리 기록</h1>
        <MileageForm logs={logs} onAdd={onAdd} />
        {total && (
          <StatList
            items={[
              { label: '전체 기간', value: `${total.days}일` },
              { label: '전체 주행', value: formatKm(total.km) },
              { label: '하루 평균', value: formatKm(total.perDay) },
            ]}
          />
        )}
      </Panel>
      <Panel>
        <h2>구간별 주행거리</h2>
        <MileageTable logs={logs} onDelete={onDelete} />
      </Panel>
    </TwoColumn>
  );
}
