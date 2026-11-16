import { REPLACEMENT_INTERVALS } from '../data/consumables.js';
import { daysBetween, getTotal, sortLogs } from './mileage.js';
import { groupByType } from './replacements.js';

const DAYS_PER_MONTH = 30.44;

const toDate = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const monthKey = (date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

// 최근 months개월의 월별 주행거리.
// 기록 구간이 두 달에 걸치면 하루 평균으로 나눠 각 달에 넣는다.
// 예: 10/30 → 11/02 (3일, 300km) = 10월 100km(31일), 11월 200km(1·2일)
export const getMonthlyKm = (logs, todayDate, months = 6) => {
  const totals = {};
  const sorted = sortLogs(logs);

  for (let i = 1; i < sorted.length; i += 1) {
    const from = toDate(sorted[i - 1].date);
    const days = daysBetween(sorted[i - 1].date, sorted[i].date);
    const perDay = (sorted[i].km - sorted[i - 1].km) / days;

    for (let d = 1; d <= days; d += 1) {
      const key = monthKey(new Date(from.getTime() + d * 86400000));
      totals[key] = (totals[key] ?? 0) + perDay;
    }
  }

  const end = toDate(todayDate);
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (months - 1 - index), 1));
    const key = monthKey(date);
    return { key, label: `${date.getUTCMonth() + 1}월`, km: Math.round(totals[key] ?? 0) };
  });
};

// 누적 주행거리 선과 그 위에 찍을 교체 시점
export const getOdometerSeries = (logs, replacements) => ({
  line: sortLogs(logs).map(({ date, km }) => ({ t: toDate(date).getTime(), date, km })),
  points: replacements.map(({ date, km, type, product }) => ({ t: toDate(date).getTime(), date, km, type, product })),
});

// 소모품별 교체 상태. ratio가 1에 가까울수록 교체할 때가 된 것이다.
export const getConsumableStatus = (replacements, currentKm, todayDate) =>
  groupByType(replacements)
    .map((group) => {
      const rule = REPLACEMENT_INTERVALS[group.type] ?? null;
      const usedKm = Math.max(0, currentKm - group.last.km);
      const usedMonths = Math.max(0, daysBetween(group.last.date, todayDate) / DAYS_PER_MONTH);

      if (!rule) return { ...group, usedKm, rule, ratio: null, remaining: null };

      const kmRatio = rule.km ? usedKm / rule.km : 0;
      const monthRatio = rule.months ? usedMonths / rule.months : 0;
      const byKm = kmRatio >= monthRatio;
      const remaining = byKm
        ? { unit: 'km', value: rule.km - usedKm }
        : { unit: '개월', value: Math.round(rule.months - usedMonths) };

      return { ...group, usedKm, rule, ratio: Math.max(kmRatio, monthRatio), remaining };
    })
    .sort((a, b) => (b.ratio ?? -1) - (a.ratio ?? -1));

// 맨 위 숫자 카드
export const getSummary = (logs, monthly, status) => {
  const total = getTotal(logs);
  const urgent = status.find((item) => item.ratio !== null);

  return {
    thisMonthKm: monthly.at(-1)?.km ?? 0,
    monthlyAverageKm: total ? total.perDay * DAYS_PER_MONTH : null,
    perDayKm: total?.perDay ?? null,
    urgent: urgent ?? null,
  };
};
