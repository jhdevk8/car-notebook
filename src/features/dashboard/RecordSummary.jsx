import Panel from '../../components/ui/Panel.jsx';
import StatList from '../../components/ui/StatList.jsx';
import { formatKm } from '../../utils/format.js';
import { getCurrentKm, getLatestInterval } from '../../utils/mileage.js';
import { sortByLatest } from '../../utils/replacements.js';

export default function RecordSummary({ data }) {
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
