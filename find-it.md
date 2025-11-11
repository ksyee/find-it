# Find It – 전국 유실물 통합 검색 서비스

## 프로젝트 개요
- **기간**: 2024.02.19 ~ 2024.03.14 (4주)  
- **팀 구성**: 프론트엔드 4인 (FE School 8기 7조)  
- **역할**: 프론트엔드 / 인터랙션 설계 / 공공 데이터 연동  
- **소개**: 경찰청 유실물 공개 API와 Supabase를 결합해, 잃어버린 물품을 빠르게 찾도록 돕는 반응형 웹 서비스입니다.  
- **배포**: https://find-it.vercel.app  
- **깃허브**: https://github.com/FRONTENDSCHOOL8/find-it

## 해결하고자 한 문제
1. 각 기관별로 흩어진 분실·습득물 데이터를 한 번에 확인하기 어렵다.  
2. 관심 물품을 반복 검색하는 과정이 비효율적이다.  
3. 사용자 간 정보 공유 창구가 부족해 사례 기반 도움을 받기 어렵다.

## 나의 기여
- **공공 데이터 파이프라인 구축**: XML 기반 경찰청 Open API를 TypeScript 친화적으로 파싱하는 유틸리티를 설계해 재사용성을 확보했습니다. (예: `src/lib/utils/getAPIData.ts`, `raiseValue.ts`, `xmlToJson.ts`)  
- **리스트/검색 UX 고도화**: React Query 기반 무한 스크롤과 `useScrollRestoration` 훅을 도입해 목록형 페이지의 연속 탐색 경험을 개선했습니다. (예: `src/entities/found/model/useFoundItemsInfinite.ts`, `src/shared/hooks/useScrollRestoration.ts`)  
- **키워드 알림 기능 개발**: Supabase와 로컬 스토리지를 연동한 키워드 추천 알림을 구현해 개인화된 습득물 추천을 제공합니다. (예: `src/pages/notification`)  
- **접근성·품질 개선**: 헤더에 스킵 내비게이션을 추가하고, 공통 로딩/에러 UI 컴포넌트(`QueryState`, `EmptyState`)를 제작해 일관된 피드백 경험을 마련했습니다.  
- **배포 파이프라인 정비**: Vercel 환경에서 HTTP/HTTPS 혼용에 따른 Mixed Content 이슈를 해결하기 위해 API Base URL을 런타임에서 동적으로 보정했습니다. (예: `src/entities/found/api/getFoundItems.ts`)

## 핵심 기능
1. **습득물/분실물 통합 리스트**  
   - React Query `useInfiniteQuery` 기반 무한 스크롤, Skeleton 로딩, 스크롤 위치 복원으로 탐색 피로도를 최소화했습니다.  
   - 기본 이미지 미등록 시 대체 이미지 처리로 빈 썸네일을 방지했습니다. (`ItemBox`)
2. **고급 검색(필터 + 기간 지정)**  
   - 카테고리(대·소분류), 지역, 기간 조건을 Zustand 전역 상태로 관리해 여러 페이지 간 검색 조건을 공유합니다. (`src/features/search/model/searchStore.ts`)  
   - 날짜를 선택하지 않으면 검색 화면으로 리다이렉트해 API 오남용을 차단합니다.  
3. **커뮤니티 & 마이페이지**  
   - Supabase를 사용한 인증/CRUD, 이메일·닉네임 중복 검증, 비밀번호 규칙 검사를 제공합니다.  
   - 자유게시판 최신 글을 메인에서 바로 확인하고, 로그인 사용자는 글쓰기 플로우로 이어집니다.
4. **키워드 알림 & 추천**  
   - 사용자가 등록한 키워드를 기반으로 최신 습득물에서 랜덤 추천을 제공하고, 읽은 알림은 즉시 제거합니다.  
   - 키워드 최대 10개 제한 및 중복 방지를 모달로 안내해 품질을 유지했습니다.
5. **접근성·UX 디테일**  
   - Skip Navigation, ARIA 레이블, 포커스 가능한 컴포넌트 설계로 키보드 이용자도 쉽게 접근할 수 있습니다.  
   - 스켈레톤/Empty 상태 컴포넌트로 로딩과 데이터 없음 상황을 명확히 전달합니다.

## 기술 스택
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Zustand, @tanstack/react-query, React Router  
- **Backend(BaaS)**: Supabase (Auth, 커뮤니티, 키워드 저장)  
- **Infra & Tools**: Vercel, ESLint, Prettier, pnpm, PostCSS  
- **외부 API**: 경찰청 유실물 공개 API, 행정표준코드 서비스(지역 코드), Tawk.to 채팅 위젯

## 시스템 구성
```
[Police Open API]──┐
                    ├─ Fetch Layer (fetch + XML → JSON 변환) ── Service (React Query) ── UI 컴포넌트
[행정표준코드 API] ─┘
                         │
                         ├─ Zustand (검색 조건/필터 상태)
                         └─ Supabase (회원·게시판·키워드)
                                        │
                                        └─ My Page / Community / Notification
```

## 개발 이슈 & 해결
| 이슈 | 해결 전략 |
| --- | --- |
| XML 응답의 중첩된 `#text` 구조로 타입 안전성이 떨어짐 | DOMParser → `xmlToJson` → `raiseValue` 체계를 설계해 모든 응답을 JSON Object로 평탄화하고, `DetailData` 타입을 기준으로 파싱 로직을 정규화했습니다. |
| HTTPS 배포 시 Mixed Content로 공공 API 호출 실패 | `resolveApiBaseUrl` 함수에서 실행 환경을 판별해 HTTPS 요청은 Vercel 프록시를 타도록 재구성했습니다. (ex. `src/entities/found/api/getFoundItems.ts`) |
| 무한 스크롤에서 페이지를 이탈 후 돌아오면 리스트 위치가 초기화됨 | `useScrollRestoration` 훅을 만들어 sessionStorage에 스크롤 위치를 저장하고, `ResizeObserver`로 DOM 렌더 완료 시점을 감지해 원위치 시켰습니다. |
| 키워드 추천 알림이 중복 저장되어 UX 저하 | 추천 데이터는 로컬 스토리지에 저장·소비하고, 키워드 삭제 시 연동 데이터를 즉시 정리하도록 했습니다. (`src/pages/notification/SettingPage.tsx`) |
| 이메일/닉네임 중복 체크 시 불필요한 API 호출 | Supabase `eq`/`or` 조건을 활용해 서버에서 선별, 프론트에서는 debounce 없이도 즉시 결과를 반환하도록 구성했습니다. |

## 협업 및 프로세스
- 디자인 시안을 먼저 확정하고 컴포넌트 기반으로 작업 영역을 분리했습니다.  
- Git flow(기능별 브랜치 → PR)와 코드 리뷰를 적용해 메인 브랜치 안정성을 유지했습니다.  
- Notion·Discord로 데일리 스탠드업, Figma로 시안 공유, Slack 워크플로로 QA 체크리스트를 관리했습니다.

## 성과 및 회고
- React Query 캐시 전략으로 동일 목록 재방문 시 API 호출을 크게 줄였습니다.  
- 사용자 테스트에서 “분실물 검색이 기존 공공사이트보다 쉽다”는 피드백을 획득했습니다.  
- 공공 데이터는 스키마 변동이 잦아 파서와 타입 정의를 별도 모듈로 분리하는 것이 유지보수에 유리함을 확인했습니다.  
- 향후 서버 사이드 캐싱과 App Shell 패턴을 적용해 초기 렌더 속도를 추가로 개선할 계획입니다.

## 링크 모음
- **배포 페이지**: https://find-it.vercel.app  
- **시연 영상**: (추가 예정)  
- **GitHub**: https://github.com/FRONTENDSCHOOL8/find-it  
- **API 명세**: `API_SPEC.md`
