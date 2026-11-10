# 내 차 수첩

주행거리와 소모품 교체 내역을 기록하는 자동차 기록 앱입니다. 폰에 설치해서 앱처럼 쓸 수 있고(PWA), 로그인하면 폰과 PC에서 같은 기록을 볼 수 있습니다.

**배포 주소:** https://car-notebook-mu.vercel.app

## 기능

- **주행거리**: 날짜별 계기판 숫자를 입력하면 구간 기간, 주행거리, 하루 평균 계산
- **소모품 기록**: 종류, 제품명, 교체일, 주행거리, 메모 저장
- **대시보드**: 소모품별 교체 횟수, 마지막 교체일, 교체 후 주행, 교체 이력
- **백업**: 기록을 JSON으로 내려받고, 현재 기록에 합쳐서 복원
- **로그인 없이 시작**: 브라우저에 저장하다가, 로그인하면 계정으로 옮기기
- **3D 차**: 손가락이나 마우스로 돌려 보고, 누르면 말랑하게 눌렸다가 튕겨 오르는 장난감 차
- **앱 설치 (PWA)**: 홈 화면 아이콘, 전체 화면 실행, 오프라인 실행. 자세한 내용은 [docs/PWA.md](docs/PWA.md)

## 기술

React, React Router, Vite, Tailwind CSS, React Three Fiber(Three.js), PWA(vite-plugin-pwa, Workbox), Supabase(PostgreSQL, Auth), Vercel

## 실행

```bash
npm install
npm run dev
```

## 구조

화면은 저장 방식을 모릅니다. `supabaseRepository`와 `localRepository`가 같은 함수를 제공하고, `App.jsx`가 로그인 상태에 따라 하나를 골라 넘깁니다.

```
화면(pages, features) → useCarRecords → repository → Supabase 또는 localStorage
```

```
src/
├── pages/          # 화면
├── features/       # 기능별 폼과 목록
├── components/     # 공통 UI, 레이아웃, 3D 차(car/)
├── hooks/          # 기록 관리, 로그인, 폼 상태
├── repositories/   # 저장 방식 (Supabase, localStorage)
└── utils/          # 주행거리 계산, 백업 검증
```

## 데이터

- 기록은 로그인한 본인만 읽고 쓸 수 있습니다(RLS).
- 삭제하면 DB에서 바로 지우지 않고 삭제 표시(`deleted_at`)만 남겨 복구할 수 있습니다.
- 다른 기기에서 넣은 기록은 탭으로 돌아올 때 다시 불러옵니다.
