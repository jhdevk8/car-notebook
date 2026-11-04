import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import Button from './components/ui/Button.jsx';
import StatusMessage from './components/ui/StatusMessage.jsx';
import { useCarRecords } from './hooks/useCarRecords.js';
import { useGuestImport } from './hooks/useGuestImport.js';
import BackupPage from './pages/BackupPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import MileagePage from './pages/MileagePage.jsx';
import ReplacementsPage from './pages/ReplacementsPage.jsx';

const PAGES = [
  { path: '/', label: '홈' },
  { path: '/mileage', label: '주행거리' },
  { path: '/replacements', label: '소모품' },
  { path: '/dashboard', label: '대시보드' },
  { path: '/backup', label: '백업', secondary: true },
];

// 기록을 불러와 각 페이지에 나눠 준다. 저장 방식은 repository가 결정한다.
export default function CarNotebook({ repository, account, guestRepository, baseNotices = [] }) {
  const records = useCarRecords(repository);
  const guestImport = useGuestImport(guestRepository, records.restore);
  const { data } = records;

  const notices = [...baseNotices];

  if (guestImport.notice) notices.push(guestImport.notice);

  if (records.syncError && data) {
    notices.push({
      id: 'sync',
      tone: 'error',
      text: `최신 기록을 가져오지 못했어요. ${records.syncError}`,
      actionLabel: '다시 시도',
      onAction: records.refresh,
    });
  }

  return (
    <AppShell pages={PAGES} account={account} notices={notices}>
      {!data && !records.loadError && <StatusMessage>기록을 불러오는 중…</StatusMessage>}

      {/* 불러오기에 실패하면 빈 화면을 보여 주지 않는다. 기록이 사라진 것처럼 보이기 때문이다. */}
      {!data && records.loadError && (
        <StatusMessage role="alert">
          <p>{records.loadError}</p>
          <Button variant="text" onClick={records.refresh}>
            다시 시도
          </Button>
        </StatusMessage>
      )}

      {data && (
        <Routes>
          <Route index element={<Home data={data} onVehicleSave={records.saveVehicle} />} />
          <Route
            path="mileage"
            element={<MileagePage logs={data.logs} onAdd={records.addLog} onDelete={records.deleteLog} />}
          />
          <Route
            path="replacements"
            element={
              <ReplacementsPage
                replacements={data.replacements}
                onAdd={records.addReplacement}
                onDelete={records.deleteReplacement}
              />
            }
          />
          <Route path="dashboard" element={<Dashboard data={data} />} />
          <Route path="backup" element={<BackupPage data={data} onRestore={records.restore} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </AppShell>
  );
}
