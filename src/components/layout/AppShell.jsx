import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Icon, { BrandMark } from '../ui/Icon.jsx';

const CONTAINER = 'page-gutter mx-auto w-full max-w-[1080px]';
const GLASS = 'border border-line bg-surface backdrop-blur-xl';

// 폰: 화면 아래 떠 있는 탭
const TAB_LINK =
  'group flex min-h-[58px] flex-col items-center justify-center gap-0.5 text-[0.7rem] font-semibold text-muted aria-[current=page]:text-accent';
const TAB_ICON =
  'grid h-7 w-11 place-items-center rounded-full transition-colors group-aria-[current=page]:bg-accent-soft';

// PC: 상단 둥근 메뉴
const TOP_LINK =
  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.9rem] font-semibold text-muted transition hover:text-ink aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent';

const ACTION_LINK =
  'inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[0.85rem] font-semibold text-muted transition hover:bg-accent-soft hover:text-ink aria-[current=page]:text-accent';

const NOTICE_TONES = { info: 'bg-accent-soft', error: 'bg-danger-soft text-danger' };

// 상단 바, 하단 탭, 알림. 화면 내용은 children으로 받는다.
// 하단 탭은 헤더 밖에 둔다. 흐림 효과(backdrop-filter)가 있는 요소 안에 넣으면 화면 대신 그 요소 기준으로 고정되기 때문이다.
export default function AppShell({ pages, account, notices, children }) {
  const { pathname } = useLocation();

  // 페이지를 옮기면 맨 위부터 보여 준다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const mainPages = pages.filter(({ secondary }) => !secondary);
  const secondaryPages = pages.filter(({ secondary }) => secondary);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/60 backdrop-blur-xl">
        <div className={`${CONTAINER} flex h-14 items-center gap-4`}>
          <Link className="flex items-center gap-2 whitespace-nowrap text-[1.02rem] font-bold" to="/">
            <BrandMark />
            내 차 수첩
          </Link>

          <nav className={`ml-auto hidden gap-0.5 rounded-full p-1 sm:flex ${GLASS}`} aria-label="주요 메뉴">
            {mainPages.map(({ path, label, icon }) => (
              <NavLink key={path} className={TOP_LINK} to={path} end={path === '/'}>
                <Icon name={icon} className="size-[17px]" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex gap-0.5 sm:ml-0">
            {secondaryPages.map(({ path, label, icon }) => (
              <NavLink key={path} className={ACTION_LINK} to={path}>
                <Icon name={icon} className="size-4" />
                {label}
              </NavLink>
            ))}
            {account && (
              <button type="button" className={ACTION_LINK} onClick={account.onClick}>
                <Icon name={account.icon} className="size-4" />
                {account.label}
              </button>
            )}
          </div>
        </div>
      </header>

      {notices.length > 0 && (
        <div className={`${CONTAINER} flex flex-col gap-2 pt-3`}>
          {notices.map(({ id, tone = 'info', text, actionLabel, onAction }) => (
            <div
              key={id}
              className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-2xl px-4 py-2.5 text-[0.85rem] ${NOTICE_TONES[tone]}`}
              data-notice={tone}
            >
              <p className="flex items-start gap-2">
                <Icon name={tone === 'error' ? 'alert' : 'info'} className="mt-0.5 size-4 shrink-0" />
                {text}
              </p>
              {actionLabel && (
                <Button variant={tone === 'error' ? 'dangerText' : 'text'} onClick={onAction}>
                  {actionLabel}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <main className={`${CONTAINER} pt-4 pb-[calc(108px+env(safe-area-inset-bottom,0px))] sm:pt-6 sm:pb-12`}>
        {children}
      </main>

      <nav
        className={`fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-20 grid grid-cols-4 rounded-[28px] px-1 shadow-[0_10px_40px_-10px_rgb(60_40_150/0.35)] sm:hidden ${GLASS}`}
        aria-label="주요 메뉴"
      >
        {mainPages.map(({ path, label, icon }) => (
          <NavLink key={path} className={TAB_LINK} to={path} end={path === '/'}>
            <span className={TAB_ICON}>
              <Icon name={icon} className="size-[21px]" />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
