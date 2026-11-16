import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Panel, { EmptyState, StatList, TwoColumn } from '../../components/ui/Panel.jsx';
import { formatDate, formatKm } from '../../utils/format.js';
import { getCurrentKm, getLatestInterval } from '../../utils/mileage.js';
import { groupByType, sortByLatest } from '../../utils/replacements.js';
import ConsumableDetail from './ConsumableDetail.jsx';

export default function DashboardPage({ data }) {
  const navigate = useNavigate();
  const groups = groupByType(data.replacements);
  const [selectedType, setSelectedType] = useState(null);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <RecordSummary data={data} />
        <Panel className="max-w-[560px] items-start">
          <h1>대시보드</h1>
          <EmptyState>교체 기록을 추가하면 소모품별 횟수와 이력이 여기에 나타나요.</EmptyState>
          <Button variant="primary" fullWidth={false} onClick={() => navigate('/replacements')}>
            교체 기록 추가
          </Button>
        </Panel>
      </div>
    );
  }

  // 선택한 소모품 기록이 삭제되면 가장 최근 소모품을 보여 준다.
  const selected = groups.find(({ type }) => type === selectedType) ?? groups[0];

  return (
    <div className="flex flex-col gap-5">
      <RecordSummary data={data} />
      <TwoColumn layout="list">
        <Panel>
          <h1>대시보드</h1>
          <p className="-mt-2.5 text-muted">
            {groups.length}종 · 총 {data.replacements.length}회 교체
          </p>
          <ConsumableList groups={groups} selectedType={selected.type} onSelect={setSelectedType} />
        </Panel>
        <ConsumableDetail group={selected} currentKm={getCurrentKm(data)} />
      </TwoColumn>
    </div>
  );
}

function RecordSummary({ data }) {
  const interval = getLatestInterval(data.logs);
  const [lastReplacement] = sortByLatest(data.replacements);

  return (
    <Panel aria-label="기록 요약">
      <StatList
        items={[
          { label: '현재 주행거리', value: formatKm(getCurrentKm(data)) },
          { label: '최근 주행', value: interval ? `${interval.days}일 동안 ${formatKm(interval.km)}` : '–' },
          { label: '최근 교체', value: lastReplacement?.type ?? '–' },
        ]}
      />
    </Panel>
  );
}

function ConsumableList({ groups, selectedType, onSelect }) {
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
