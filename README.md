# 내 차 수첩

소모품 교체 내역과 주행거리를 기록하고, 교체한 소모품을 3D로 보여 주는 자동차 기록 앱입니다. 로그인 없이 바로 쓸 수 있고, 로그인하면 폰과 PC에서 같은 기록을 볼 수 있습니다.

## 기능

- **홈**: 차종, 3D 모델 자리, 현재 주행거리
- **소모품 기록**: 종류, 제품명, 교체일, 주행거리, 메모 저장
- **주행거리**: 날짜별 계기판 숫자를 입력하면 구간 기간, 주행거리, 하루 평균 계산
- **대시보드**: 최근 주행과 교체 요약, 소모품별 교체 횟수, 마지막 교체일, 교체 후 주행, 교체 이력
- **백업**: 기록을 JSON으로 내려받고, 현재 기록에 합쳐서 복원
- **로그인 없이 시작**: 브라우저에 저장하다가, 로그인하면 계정으로 옮기기

## 기술

React, React Router, Vite, Tailwind CSS, Supabase(PostgreSQL, Auth)

## 실행

```bash
npm install
npm run dev
```

## Supabase 설정

1. Supabase 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase/schema.sql`을 실행합니다.
3. `.env.example`을 `.env.local`로 복사하고 Connect 창의 Project URL과 publishable key를 넣습니다.
4. 지금은 다른 사용자를 받지 않으므로 앱의 가입 버튼을 숨겼습니다(`src/config/auth.js`). 가입을 막으려면 Authentication 설정에서도 끄고, 내 계정은 대시보드의 Users에서 만듭니다.

`.env.local`이 없으면 로그인 메뉴 없이 브라우저 저장으로만 실행됩니다. secret key는 프론트 코드에 넣지 않습니다.

무료 요금제에는 자동 백업이 없으므로 백업 화면에서 JSON 파일을 주기적으로 내려받습니다.

## 페이지

| 주소 | 화면 |
|---|---|
| `/#/` | 홈 |
| `/#/mileage` | 주행거리 |
| `/#/replacements` | 소모품 기록 |
| `/#/dashboard` | 대시보드 |
| `/#/backup` | 백업 |
| `/#/login` | 로그인 |

## 구조

화면은 저장 방식을 모릅니다. `supabaseRepository`와 `localRepository`가 같은 함수를 제공하고, `App.jsx`가 로그인 상태에 따라 하나를 골라 넘깁니다.

```
화면(pages, features) → useCarRecords → repository → Supabase 또는 localStorage
```

```
src/
├── App.jsx                # 로그인 상태에 따라 저장소 선택
├── CarNotebook.jsx        # 기록 불러오기, 페이지 전환
├── lib/supabaseClient.js  # Supabase 연결
├── services/authService.js# 로그인, 가입, 로그아웃
├── repositories/          # 저장 방식 (Supabase, localStorage), 오류 문구 변환
├── hooks/                 # useAuth, useCarRecords, useForm, useGuestImport
├── utils/                 # 주행거리 계산, 소모품 묶기, 백업 검증, 날짜·거리 표시
├── styles.css             # 색상 값(라이트, 다크), Tailwind 테마, 기본 스타일
├── components/ui/         # Button, Field, Panel, StatList, DeleteButton 등 공통 UI
├── components/layout/     # 상단 메뉴, 알림 띠
├── components/            # ModelStage(3D 자리), Odometer
├── features/              # 기능별 폼과 목록 (auth, home, mileage, replacements, dashboard, backup)
├── pages/                 # 기능을 조합한 화면
├── config/auth.js         # 가입 허용 여부
└── data/                  # 소모품 종류, 빈 기록
```

## 데이터

- 기록은 로그인한 본인만 읽고 쓸 수 있습니다(RLS).
- 앱에서 삭제하면 DB에 삭제 표시(`deleted_at`)만 남기고 지우지 않습니다.
- 다른 기기에서 넣은 기록은 탭으로 돌아올 때 다시 불러옵니다.
