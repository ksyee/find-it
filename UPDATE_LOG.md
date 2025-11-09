# Recent Fix Summary

## Authentication & Community Changes

- Consolidated PocketBase usage to `src/lib/api/getPbData.ts` and removed the duplicate util. All components now share a single client instance.
- Hardened localStorage usage by gating it with browser checks across Main, Community, Notification, and Account pages to prevent SSR crashes.

## Community & UI

- `PostBox` now fetches posts within the component and shows loading/error states instead of relying on a module-level `await`.
- Kakao map overlays no longer interpolate user strings into HTML, preventing XSS.
- Removed non-functional "최근 활동" card and dead "전화하기" button from detail pages.
- Refreshed 자유게시판 layout: search banner is always visible and the header search icon was removed to avoid overlap.

## Account Flows

- Login/Signup forms now reserve header height on mobile so inputs are not obscured.
- Signup/Create Post pages load user nickname safely from localStorage on the client.
- Mypage entry/edit/delete screens fetch auth info inside `useEffect` and guard PocketBase calls if the user id is missing.
- MyPage now derives profile info from state, shows a loading fallback, and handles logouts via props.

## Notification / Region Selection

- Region selector works even when 행정동 API token is unavailable thanks to fallback 시/도/군구 lists.
- Keyword notification tabs and badges guard all localStorage access.

## Signup Improvements

- Signup no longer queries PocketBase directly for duplicates (403 errors). Instead, server validation errors are surfaced to the user, and the submit button states reflect actual readiness.
- Added user-facing error messaging when duplicate checks are unavailable.

## Misc

- CRUD helper functions now await responses and rethrow errors so callers can handle them properly.
- Documented all behavior changes here for quick reference.
