# Find It – 전국 유실물 통합 검색 서비스

경찰청 유실물 공개 API와 PocketBase를 결합해 전국의 분실·습득물 데이터를 한 번에 탐색할 수 있는 반응형 웹 애플리케이션입니다. 잃어버린 물품을 찾는 시민과 현장에서 돕고 싶은 커뮤니티를 하나의 경험으로 잇습니다.

[🔗 라이브 데모](https://find-it-alpha.vercel.app/) · [📄 API 명세](API_SPEC.md) · [🗒 프로젝트 노트](find-it.md)

## About

- 기간: 2024.02.19 ~ 2024.03.14 (팀 프로젝트) + 2025.05 ~ 현재 개인 리팩토링
- 형태: FE School 8기 7조, 프론트엔드 4인 협업
- 역할: 프론트엔드 리드 / 인터랙션 설계 / 공공 데이터 연동 / 배포 운영
- 배포: Vercel (상단 라이브 데모 링크 참고)

## 내 역할 한눈에 보기

- 공공 데이터 파이프라인 표준화: XML 응답을 TypeScript 친화 데이터로 변환하는 `xmlToJson → raiseValue → getAPIData` 체계를 설계해 재사용 가능한 fetch 레이어를 구축했습니다 (`src/lib/utils/xmlToJson.ts:4`, `src/lib/utils/raiseValue.ts:3`, `src/lib/utils/getAPIData.ts:69`).
- 탐색 경험 고도화: React Query 무한 스크롤과 스크롤 위치 복원을 결합해 목록을 끊김 없이 탐험할 수 있도록 만들었습니다 (`src/pages/find/GetListPage.tsx:12`, `src/entities/found/model/useFoundItemsInfinite.ts:20`, `src/shared/hooks/useScrollRestoration.ts:5`).
- 개인화 알림 & 배포 안정화: PocketBase 기반 키워드 알림과 Mixed Content 이슈를 해결하는 runtime URL 보정/프록시 구성을 담당했습니다 (`src/pages/notification/SettingPage.tsx:35`, `src/pages/notification/NoticePage.tsx:48`, `src/entities/found/api/getFoundItems.ts:23`, `vercel.json:4`).

## 문제와 해결

- **기관마다 흩어진 유실물 데이터** → 경찰청 공개 API와 자체 프록시를 엮어 최신 습득/분실 정보를 단일 검색 경험으로 통합했습니다.
- **반복되는 검색과 낮은 재방문율** → 키워드 알림과 무한 스크롤, 스크롤 복원으로 사용자가 중단 없이 돌아오도록 설계했습니다.
- **경험 공유의 부재** → PocketBase 커뮤니티 탭을 통해 분실/습득 경험을 기록하고 서로 도울 수 있는 공간을 만들었습니다.

## 핵심 기능

- 전국 습득물/분실물 통합 탐색: React Query `useInfiniteQuery`와 사용자 스크롤 상태 복원을 결합해 끊김 없는 탐색을 제공합니다 (`src/pages/find/GetListPage.tsx:12`, `src/entities/found/model/useFoundItemsInfinite.ts:20`, `src/shared/hooks/useScrollRestoration.ts:5`).
- 조건 검색 & 행정동 필터: Zustand 스토어와 행정표준코드 API 토큰 관리 훅으로 지역·기간·카테고리 필터를 페이지 간 공유합니다 (`src/features/search/model/searchStore.ts:18`, `src/hooks/location/useLocationList.ts:15`, `src/lib/utils/useGetToken.tsx:8`).
- 키워드 알림과 추천: PocketBase 사용자 데이터와 로컬 스토리지를 연동해 키워드 최대 10개 제한, 중복 방지, 추천 목록을 제공합니다 (`src/pages/notification/SettingPage.tsx:35`, `src/pages/notification/NoticePage.tsx:48`).
- 커뮤니티 & 마이페이지: PocketBase SDK로 인증과 게시글 CRUD를 처리하고 메인에서 최신 글을 노출합니다 (`src/lib/utils/pb.tsx:1`, `src/pages/main/MainPage.tsx:83`).
- 상세 보기 + 지도 안내: Kakao 지도 SDK를 비동기로 로드해 보관 장소와 연락처를 시각화합니다 (`src/entities/item/ui/ItemDetail.tsx:1`, `src/shared/ui/KakaoMap.tsx:1`).

## 아키텍처

```text
Police Open API ─┐
                 ├─ Fetch Layer (xmlToJson → raiseValue → getAPIData) ── React Query cache
행정표준코드 API ┤
                 └─ Zustand Stores (검색 조건, 상세 데이터)
PocketBase ──────→ Auth / Community / Keyword 알림
                               │
                               └─ React Router Pages + Tailwind UI
```

- `app/`: 라우팅, 레이아웃, 글로벌 프로바이더 (`src/app/providers/AppProviders.tsx:7`)
- `entities/` & `features/`: 도메인 비즈니스 로직과 상태 모델 (`src/entities/found/model/useFoundItemsInfinite.ts:20`, `src/features/search/model/searchStore.ts:18`)
- `shared/`: 공통 UI, 훅, 유틸리티 (`src/shared/ui/QueryState.tsx:15`, `src/shared/hooks/useScrollRestoration.ts:5`)
- `widgets/` & `pages/`: 조합 가능한 UI 모듈과 화면 컴포지션 (`src/widgets/header/ui/Header.tsx:31`, `src/pages/main/MainPage.tsx:152`)

## Engineering Highlights

### 공공 데이터 파이프라인

- DOMParser로 받은 XML을 JSON으로 평탄화 후 `#text` 노드를 추출해 타입 안전한 객체로 변환합니다 (`src/lib/utils/xmlToJson.ts:4`, `src/lib/utils/raiseValue.ts:3`).
- 모든 API 래퍼에서 공통 옵션과 오류를 처리해 UI 레이어가 일관된 예외 메시지를 사용할 수 있습니다 (`src/lib/utils/getAPIData.ts:69`, `src/lib/utils/lostAPIData.ts:49`).

### Mixed Content 없는 배포 환경

- 실행 환경에 따라 API Base URL을 동적으로 보정해 HTTPS 환경에서도 안전하게 호출합니다 (`src/entities/found/api/getFoundItems.ts:23`, `src/lib/utils/getPocketBaseUrl.ts:17`).
- Vercel rewrite로 서버 API와 클라이언트 SPA를 분리 배포했습니다 (`vercel.json:4`).

### 데이터 캐싱과 탐색 경험

- QueryClient 기본 옵션에서 재시도/포커스 refetch 정책을 조정해 네트워크 효율과 UX 균형을 맞췄습니다 (`src/app/providers/AppProviders.tsx:7`).
- 무한 스크롤과 스크롤 상태 저장으로 페이지 이동 후에도 사용자가 탐색하던 위치로 복귀합니다 (`src/shared/hooks/useScrollRestoration.ts:5`, `src/pages/find/GetListPage.tsx:30`).

### 행정동 데이터 토큰 관리

- 행정표준코드 API 토큰을 주기적으로 재발급하고 요청 실패를 방지합니다 (`src/lib/utils/useGetToken.tsx:8`).
- 시·도/군·구 목록 훅을 분리해 검색 컴포넌트가 의존성을 주입받을 수 있도록 했습니다 (`src/hooks/location/useLocationList.ts:15`).

### 개인화 추천 루프

- PocketBase 사용자 레코드를 기반으로 키워드를 관리하고, 추천 데이터는 로컬 스토리지로 즉시 반영합니다 (`src/pages/notification/SettingPage.tsx:63`, `src/pages/notification/NoticePage.tsx:75`).
- 추천 클릭 시 세션 캐시를 정리하고 상세 페이지로 라우팅해 중복 알림을 방지합니다 (`src/pages/notification/NoticePage.tsx:98`).

## UX & 접근성

- 최초 방문자에게 브랜드 스토리텔링을 제공하는 스플래시와 오류 복구 가능한 Error Boundary를 구성했습니다 (`src/App.tsx:24`, `src/shared/ui/ErrorBoundary.tsx:48`).
- 전역 Skip Navigation과 포커스 아웃라인으로 키보드 접근성을 보장했습니다 (`src/widgets/header/ui/Header.tsx:154`, `src/main.css:72`).
- Skeleton/Empty/QueryState 컴포넌트로 로딩·에러 피드백을 일관되게 제공합니다 (`src/shared/ui/QueryState.tsx:15`, `src/shared/ui/EmptyState.tsx:6`).
- 데스크톱 환경에서 레이아웃 점프를 막기 위해 고정 스크롤바 폭을 예약합니다 (`src/desktop-scrollbar.css:1`).

## Tech Stack

- Frontend: React 18, TypeScript, Vite, TailwindCSS v4 (`src/main.css:1`)
- State & Async: TanStack Query, React Router, Zustand (`src/app/providers/AppProviders.tsx:7`, `src/features/search/model/searchStore.ts:18`)
- BaaS & External: PocketBase, Police Open API, 행정표준코드 API, Kakao Maps (`src/lib/utils/pb.tsx:1`, `src/shared/ui/KakaoMap.tsx:1`)
- Tooling & Infra: Vercel, pnpm, ESLint, Prettier, PostCSS (`package.json:6`)

## Roadmap

- 서버 사이드 캐싱과 CDN을 결합해 초기 로딩 속도를 더 개선하고자 합니다.
- App Shell + Suspense boundary를 세분화해 주요 페이지의 지각 로딩을 줄일 계획입니다.
- 이메일 알림/푸시 연동으로 키워드 추천을 실시간으로 전달하는 것을 검토하고 있습니다.

## Links

- GitHub (팀 저장소): https://github.com/FRONTENDSCHOOL8/find-it
- API 명세: API_SPEC.md
