import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Panel from '../components/ui/Panel.jsx';
import ConsumableDetail from '../features/dashboard/ConsumableDetail.jsx';
import ConsumableList from '../features/dashboard/ConsumableList.jsx';
import RecordSummary from '../features/dashboard/RecordSummary.jsx';
import { getCurrentKm } from '../utils/mileage.js';
import { groupByType } from '../utils/replacements.js';

export default function Dashboard({ data }) {
  const navigate = useNavigate();
  const groups = groupByType(data.replacements);
  const [selectedType, setSelectedType] = useState(null);

  if (groups.length === 0) {
    return (
      <div className="page-stack">
        <RecordSummary data={data} />
        <Panel className="dashboard-empty">
          <h1>대시보드</h1>
          <EmptyState>교체 기록을 추가하면 소모품별 횟수와 이력이 여기에 나타나요.</EmptyState>
          <Button variant="primary" onClick={() => navigate('/replacements')}>
            교체 기록 추가
          </Button>
        </Panel>
      </div>
    );
  }

  // 선택한 소모품 기록이 삭제되면 가장 최근 소모품을 보여 준다.
  const selected = groups.find(({ type }) => type === selectedType) ?? groups[0];

  return (
    <div className="page-stack">
      <RecordSummary data={data} />
      <div className="dashboard">
        <Panel>
          <h1>대시보드</h1>
          <p className="dashboard-summary">
            {groups.length}종 · 총 {data.replacements.length}회 교체
          </p>
          <ConsumableList groups={groups} selectedType={selected.type} onSelect={setSelectedType} />
        </Panel>
        <ConsumableDetail group={selected} currentKm={getCurrentKm(data)} />
      </div>
    </div>
  );
}
