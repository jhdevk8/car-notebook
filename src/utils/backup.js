const APP_ID = 'car-notebook';
const BACKUP_VERSION = 1;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (date) => typeof date === 'string' && DATE_PATTERN.test(date);
const isValidKm = (km) => Number.isInteger(km) && km >= 0;

const isValidLog = (log) => isValidDate(log?.date) && isValidKm(log?.km);

const isValidReplacement = (item) =>
  typeof item?.id === 'string' &&
  typeof item?.type === 'string' &&
  typeof item?.product === 'string' &&
  typeof item?.memo === 'string' &&
  isValidDate(item?.date) &&
  isValidKm(item?.km);

export const buildBackup = ({ vehicle, logs, replacements }) => ({
  app: APP_ID,
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  vehicle,
  logs,
  replacements,
});

export const getBackupFileName = (date) => `car-notebook-backup-${date}.json`;

// 잘못된 파일이면 안내 문구와 함께 오류를 던진다.
export const parseBackup = (text) => {
  let backup;

  try {
    backup = JSON.parse(text);
  } catch {
    throw new Error('JSON 파일을 읽지 못했어요.');
  }

  if (backup?.app !== APP_ID || !Array.isArray(backup.logs) || !Array.isArray(backup.replacements)) {
    throw new Error('내 차 수첩 백업 파일이 아니에요.');
  }

  if (!backup.logs.every(isValidLog) || !backup.replacements.every(isValidReplacement)) {
    throw new Error('백업 파일에 잘못된 기록이 있어요.');
  }

  return { vehicle: backup.vehicle ?? '', logs: backup.logs, replacements: backup.replacements };
};
