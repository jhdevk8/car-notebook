import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatDate, formatKm } from '../../utils/format.js';

// Recharts는 용량이 커서 이 파일은 대시보드에 들어갈 때만 불러온다.

const AXIS = { stroke: 'var(--muted)', fontSize: 12, tickLine: false, axisLine: false };
const TOOLTIP = {
  contentStyle: {
    background: 'var(--bg)',
    border: '1px solid var(--line)',
    borderRadius: 14,
    color: 'var(--ink)',
    fontSize: 13,
  },
  labelStyle: { color: 'var(--muted)' },
  cursor: { fill: 'var(--accent-soft)' },
};

// 축 숫자는 짧게: 1,200 → 1.2k, 157,000 → 157k
const shortKm = (km) => {
  if (km < 1000) return `${km}`;
  return `${(km / 1000).toFixed(km < 10000 ? 1 : 0).replace(/\.0$/, '')}k`;
};

export function MonthlyChart({ data, average }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="monthlyBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis dataKey="label" {...AXIS} />
        <YAxis {...AXIS} width={40} tickFormatter={shortKm} />
        <Tooltip {...TOOLTIP} formatter={(value) => [formatKm(value), '주행']} />
        {average > 0 && (
          <ReferenceLine
            y={average}
            stroke="var(--muted)"
            strokeDasharray="4 4"
            label={{ value: '평균', position: 'insideTopRight', fill: 'var(--muted)', fontSize: 11 }}
          />
        )}
        <Bar dataKey="km" fill="url(#monthlyBar)" radius={[8, 8, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function OdometerTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div style={TOOLTIP.contentStyle} className="px-3 py-2">
      <p className="text-muted">{formatDate(item.date)}</p>
      {item.type ? (
        <p>
          <strong>{item.type}</strong> {item.product}
        </p>
      ) : null}
      <p className="tabular-nums">{formatKm(item.km)}</p>
    </div>
  );
}

export function OdometerChart({ line, points }) {
  const dateTick = (t) => {
    const date = new Date(t);
    return `${String(date.getUTCFullYear()).slice(2)}.${date.getUTCMonth() + 1}`;
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickCount={5} tickFormatter={dateTick} {...AXIS} />
        <YAxis dataKey="km" type="number" domain={['auto', 'auto']} width={44} tickFormatter={shortKm} {...AXIS} />
        <Tooltip content={<OdometerTooltip />} cursor={{ stroke: 'var(--line)' }} />
        <Line data={line} dataKey="km" type="monotone" stroke="var(--accent)" strokeWidth={2.5} dot={false} />
        <Scatter data={points} dataKey="km" fill="var(--accent-2)" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
