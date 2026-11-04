-- 내 차 수첩 테이블과 접근 권한
-- Supabase 대시보드의 SQL Editor에 붙여 넣고 한 번 실행한다.

create table public.vehicles (
  user_id uuid primary key default auth.uid() references auth.users (id),
  name text not null default '',
  updated_at timestamptz not null default now()
);

create table public.mileage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id),
  log_date date not null,
  km integer not null check (km >= 0),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- 삭제되지 않은 기록끼리만 날짜 중복을 막는다. 지운 날짜는 다시 입력할 수 있다.
create unique index mileage_logs_one_per_day
  on public.mileage_logs (user_id, log_date)
  where deleted_at is null;

create table public.replacements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id),
  type text not null,
  product text not null,
  replaced_on date not null,
  km integer not null check (km >= 0),
  memo text not null default '',
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index replacements_by_user on public.replacements (user_id, replaced_on desc);

-- Supabase는 새 테이블에 anon과 authenticated 권한을 기본으로 열어 둔다. 먼저 모두 거둔다.
revoke all on public.vehicles, public.mileage_logs, public.replacements from anon;
revoke all on public.vehicles, public.mileage_logs, public.replacements from authenticated;

-- 로그인한 사용자만 접근할 수 있다.
-- delete 권한은 주지 않는다. 앱의 삭제는 deleted_at을 채우는 update로 처리한다.
grant select, insert, update on public.vehicles to authenticated;
grant select, insert, update on public.mileage_logs to authenticated;
grant select, insert, update on public.replacements to authenticated;

-- 자기 기록만 읽고 쓸 수 있다.
alter table public.vehicles enable row level security;
alter table public.mileage_logs enable row level security;
alter table public.replacements enable row level security;

create policy "own vehicle" on public.vehicles
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own mileage logs" on public.mileage_logs
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own replacements" on public.replacements
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
