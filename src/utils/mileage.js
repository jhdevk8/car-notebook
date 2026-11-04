const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toUtc = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

export const daysBetween = (from, to) => (toUtc(to) - toUtc(from)) / MS_PER_DAY;

// 날짜 오름차순으로 정렬한 새 배열을 돌려준다.
export const sortLogs = (logs) => [...logs].sort((a, b) => toUtc(a.date) - toUtc(b.date));

// 두 기록 사이의 기간, 주행거리, 하루 평균을 계산한다.
// 예: 11/02 153,200km -> 11/05 157,000km = 3일, 3,800km, 하루 1,267km
export const calcInterval = (from, to) => {
  const days = daysBetween(from.date, to.date);
  const km = to.km - from.km;
  return { days, km, perDay: days > 0 ? km / days : 0 };
};

// 표에 쓸 행을 최신순으로 만든다. 가장 오래된 기록은 비교 대상이 없어 interval이 null이다.
export const buildRows = (logs) => {
  const sorted = sortLogs(logs);
  return sorted
    .map((log, index) => ({
      ...log,
      interval: index > 0 ? calcInterval(sorted[index - 1], log) : null,
    }))
    .reverse();
};

export const getLatestLog = (logs) => sortLogs(logs).at(-1) ?? null;

export const getLatestInterval = (logs) => {
  const sorted = sortLogs(logs);
  return sorted.length >= 2 ? calcInterval(sorted.at(-2), sorted.at(-1)) : null;
};

// 첫 기록부터 마지막 기록까지의 전체 합계
export const getTotal = (logs) => {
  const sorted = sortLogs(logs);
  return sorted.length >= 2 ? calcInterval(sorted[0], sorted.at(-1)) : null;
};

// 입력한 날짜 바로 앞의 기록 (입력 중 미리보기에 사용)
export const findPreviousLog = (logs, date) =>
  sortLogs(logs).filter((log) => toUtc(log.date) < toUtc(date)).at(-1) ?? null;

const findNextLog = (logs, date) =>
  sortLogs(logs).find((log) => toUtc(log.date) > toUtc(date)) ?? null;

// 문제가 있으면 안내 문구를, 없으면 빈 문자열을 돌려준다.
export const validateLog = (logs, { date, km }) => {
  if (logs.some((log) => log.date === date)) {
    return '이 날짜에는 이미 기록이 있어요. 기존 기록을 지우고 다시 입력해 주세요.';
  }

  const previous = findPreviousLog(logs, date);
  if (previous && km < previous.km) {
    return `이전 기록(${previous.km.toLocaleString('ko-KR')}km)보다 작을 수 없어요.`;
  }

  const next = findNextLog(logs, date);
  if (next && km > next.km) {
    return `이후 기록(${next.km.toLocaleString('ko-KR')}km)보다 클 수 없어요.`;
  }

  return '';
};

// 주행거리 기록과 교체 기록 중 가장 큰 값을 현재 주행거리로 본다.
export const getCurrentKm = ({ logs, replacements }) =>
  Math.max(0, ...logs.map((log) => log.km), ...replacements.map((item) => item.km));
