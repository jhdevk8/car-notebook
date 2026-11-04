// 최신 교체일이 먼저 오도록 정렬한다.
export const sortByLatest = (items) => [...items].sort((a, b) => b.date.localeCompare(a.date));

// 소모품 종류별로 묶어 횟수와 마지막 교체 기록을 계산한다.
export const groupByType = (replacements) => {
  const groups = {};

  sortByLatest(replacements).forEach((item) => {
    groups[item.type] = groups[item.type] ?? [];
    groups[item.type].push(item);
  });

  return Object.entries(groups)
    .map(([type, items]) => ({ type, items, count: items.length, last: items[0] }))
    .sort((a, b) => b.last.date.localeCompare(a.last.date));
};
