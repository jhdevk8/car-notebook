import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Panel, { EmptyState, StatList } from '../../components/ui/Panel.jsx';
import { formatDate, formatKm, today } from '../../utils/format.js';
import { getCurrentKm } from '../../utils/mileage.js';
import { getConsumableStatus, getMonthlyKm, getOdometerSeries, getSummary } from '../../utils/stats.js';

const MonthlyChart = lazy(() => import('./DashboardCharts.jsx').then((m) => ({ default: m.MonthlyChart })));
const OdometerChart = lazy(() => import('./DashboardCharts.jsx').then((m) => ({ default: m.OdometerChart })));

const NEED_TWO_LOGS = '주행거리를 2번 이상 기록하면 그래프가 나와요.';

export default function DashboardPage({ data }) {
  const todayDate = today();
  const currentKm = getCurrentKm(data);
  const monthly = getMonthlyKm(data.logs, todayDate);
  const status = getConsumableStatus(data.replacements, currentKm, todayDate);
  const summary = getSummary(data.logs, monthly, status);
  const hasTrend = data.logs.length >= 2;

  return (
    <div className="flex flex-col gap-5">
      <Panel aria-label="요약">
        <h1>대시보드</h1>
        <StatList
          items={[
            { label: '이번 달 주행', value: formatKm(summary.thisMonthKm) },
            { label: '월 평균', value: summary.monthlyAverageKm === null ? '–' : formatKm(summary.monthlyAverageKm) },
            { label: '하루 평균', value: summary.perDayKm === null ? '–' : formatKm(summary.perDayKm) },
            { label: '교체 임박', value: summary.urgent?.type ?? '–' },
          ]}
        />
      </Panel>

      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
        <ChartPanel title="월별 주행거리" hasData={hasTrend}>
          <MonthlyChart data={monthly} average={summary.monthlyAverageKm ?? 0} />
        </ChartPanel>
        <ChartPanel title="누적 주행거리" hint="점은 소모품을 교체한 때예요." hasData={hasTrend}>
          <OdometerChart {...getOdometerSeries(data.logs, data.replacements)} />
        </ChartPanel>
      </div>

      <ConsumableStatus status={status} />
    </div>
  );
}

function ChartPanel({ title, hint, hasData, children }) {
  return (
    <Panel>
      <div>
        <h2>{title}</h2>
        {hint && <p className="mt-1 text-[0.85rem] text-muted">{hint}</p>}
      </div>
      {hasData ? (
        <Suspense fallback={<div className="h-[220px] animate-pulse rounded-2xl bg-surface-2" />}>{children}</Suspense>
      ) : (
        <EmptyState>{NEED_TWO_LOGS}</EmptyState>
      )}
    </Panel>
  );
}

const barColor = (ratio) => {
  if (ratio >= 1) return 'bg-danger';
  if (ratio >= 0.8) return 'bg-gradient-to-r from-accent to-danger';
  return 'bg-gradient-to-r from-accent to-accent-2';
};

const remainingText = ({ ratio, remaining }) => {
  if (ratio === null) return '권장 주기 없음';
  if (ratio >= 1) return '교체할 때가 됐어요';
  return remaining.unit === 'km' ? `${formatKm(remaining.value)} 남음` : `${remaining.value}개월 남음`;
};

// 소모품마다 권장 주기 대비 사용량을 막대로 보여 주고, 누르면 교체 이력을 펼친다.
function ConsumableStatus({ status }) {
  const navigate = useNavigate();
  const [openType, setOpenType] = useState(null);

  return (
    <Panel>
      <div>
        <h2>소모품 교체 상태</h2>
        <p className="mt-1 text-[0.85rem] text-muted">권장 주기는 일반적인 기준이에요. 누르면 교체 이력이 보여요.</p>
      </div>

      {status.length === 0 ? (
        <>
          <EmptyState>교체 기록을 추가하면 소모품별 상태가 여기에 나타나요.</EmptyState>
          <Button variant="primary" fullWidth={false} onClick={() => navigate('/replacements')}>
            교체 기록 추가
          </Button>
        </>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {status.map((item) => {
            const isOpen = openType === item.type;
            return (
              <li key={item.type}>
                <button
                  type="button"
                  className="flex w-full flex-col gap-2 rounded-2xl px-3.5 py-3 text-left transition hover:bg-surface-2 aria-expanded:bg-surface-2"
                  aria-expanded={isOpen}
                  onClick={() => setOpenType(isOpen ? null : item.type)}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-bold">
                      {item.type} <span className="text-[0.82rem] font-semibold text-muted">{item.count}회</span>
                    </span>
                    <span
                      className={`text-[0.85rem] font-semibold tabular-nums ${item.ratio >= 1 ? 'text-danger' : 'text-muted'}`}
                    >
                      {remainingText(item)}
                    </span>
                  </span>
                  {item.ratio !== null && (
                    <span className="h-2 overflow-hidden rounded-full bg-accent-soft">
                      <span
                        className={`block h-full rounded-full ${barColor(item.ratio)}`}
                        style={{ width: `${Math.min(100, Math.max(4, item.ratio * 100))}%` }}
                      />
                    </span>
                  )}
                  <span className="text-[0.8rem] text-muted tabular-nums">
                    마지막 {formatDate(item.last.date)} · 교체 후 {formatKm(item.usedKm)}
                  </span>
                </button>

                {isOpen && <History items={item.items} />}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function History({ items }) {
  return (
    <ol className="mx-3.5 mt-2 mb-3 ml-5 flex flex-col">
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
  );
}
