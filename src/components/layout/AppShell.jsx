import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button.jsx';

function PageLink({ path, label }) {
  return (
    <NavLink className="nav-link" to={path} end={path === '/'}>
      {label}
    </NavLink>
  );
}

// 상단 메뉴와 알림 띠. 폰에서는 CSS가 주요 메뉴를 화면 아래 탭으로 옮긴다.
export default function AppShell({ pages, account, notices, children }) {
  const mainPages = pages.filter(({ secondary }) => !secondary);
  const secondaryPages = pages.filter(({ secondary }) => secondary);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" to="/">
            내 차 수첩
          </Link>
          <nav className="main-nav" aria-label="주요 메뉴">
            {mainPages.map(({ path, label }) => (
              <PageLink key={path} path={path} label={label} />
            ))}
          </nav>
          <div className="topbar-actions">
            {secondaryPages.map(({ path, label }) => (
              <PageLink key={path} path={path} label={label} />
            ))}
            {account && (
              <button type="button" className="nav-link" onClick={account.onClick}>
                {account.label}
              </button>
            )}
          </div>
        </div>
      </header>

      {notices.map(({ id, tone = 'info', text, actionLabel, onAction }) => (
        <div key={id} className={`notice notice-${tone}`}>
          <div className="notice-inner">
            <p>{text}</p>
            {actionLabel && (
              <Button variant="text" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      ))}

      <main className="page">{children}</main>
    </div>
  );
}
