export const formatKm = (km) => `${Math.round(km).toLocaleString('ko-KR')}km`;

// '2025-11-05' -> '2025.11.05'
export const formatDate = (date) => date.replaceAll('-', '.');

// 입력칸 기본값으로 쓸 오늘 날짜 (사용자 시간대 기준)
export const today = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};
