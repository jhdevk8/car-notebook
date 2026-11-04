import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Button from '../ui/Button.jsx';

const CONTAINER = 'page-gutter mx-auto max-w-[1180px]';

const ACTION_LINK =
  'inline-flex min-h-10 items-center whitespace-nowrap border-b-2 border-transparent px-2 py-1.5 text-[0.9rem] font-medium text-muted hover:text-ink aria-[current=page]:border-accent aria-[current=page]:text-ink sm:min-h-0 sm:px-2.5 sm:text-[15px]';

// 폰에서는 화면 아래 탭, PC에서는 상단 메뉴
const MAIN_LINK =
  'flex min-h-[54px] items-center justify-center whitespace-nowrap border-t-2 border-transparent p-1 font-medium text-muted hover:text-ink aria-[current=page]:border-accent aria-[current=page]:font-bold aria-[current=page]:text-accent sm:inline-flex sm:min-h-0 sm:border-t-0 sm:border-b-2 sm:px-2.5 sm:py-1.5 sm:aria-[current=page]:font-medium sm:aria-[current=page]:text-ink';

const NOTICE_TONES = { info: 'bg-accent-soft', error: 'bg-danger-soft' };

// 상단 메뉴와 알림 띠. 화면 내용은 children으로 받는다.
export default function AppShell({ pages, account, notices, children }) {
  const { pathname } = useLocation();

  // 페이지를 옮기면 맨 위부터 보여 준다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const mainPages = pages.filter(({ secondary }) => !secondary);
  const secondaryPages = pages.filter(({ secondary }) => secondary);

  return (
    <div>
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-10 border-b border-line bg-bg">
        <div className={`${CONTAINER} flex items-center gap-x-5 py-1.5 sm:py-2.5`}>
          <Link className="whitespace-nowrap text-[1.05rem] font-bold" to="/">
            내 차 수첩
          </Link>
          <nav
            className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t border-line bg-surface pr-[env(safe-area-inset-right,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] sm:static sm:ml-auto sm:flex sm:gap-0.5 sm:border-t-0 sm:bg-transparent sm:p-0"
            aria-label="주요 메뉴"
          >
            {mainPages.map(({ path, label }) => (
              <NavLink key={path} className={MAIN_LINK} to={path} end={path === '/'}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex gap-0.5 sm:ml-0">
            {secondaryPages.map(({ path, label }) => (
              <NavLink key={path} className={ACTION_LINK} to={path}>
                {label}
              </NavLink>
            ))}
            {account && (
              <button type="button" className={ACTION_LINK} onClick={account.onClick}>
                {account.label}
              </button>
            )}
          </div>
        </div>
      </header>

      {notices.map(({ id, tone = 'info', text, actionLabel, onAction }) => (
        <div key={id} className={NOTICE_TONES[tone]} data-notice={tone}>
          <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 py-[7px] text-[0.9rem]`}>
            <p>{text}</p>
            {actionLabel && (
              <Button variant={tone === 'error' ? 'dangerText' : 'text'} onClick={onAction}>
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      ))}

      <main className={`${CONTAINER} pt-4 pb-[calc(78px+env(safe-area-inset-bottom,0px))] sm:pt-6 sm:pb-12`}>
        {children}
      </main>
    </div>
  );
}
