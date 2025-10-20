# FindIt Server API 명세서

**프로젝트**: FindIt - 분실물/습득물 통합 검색 서비스
**Base URL (Production)**: `http://52.79.241.212:8080/api`
**Base URL (Local)**: `http://localhost:8080/api`
**버전**: 1.0.0
**최종 업데이트**: 2025-10-15

---

## 📋 목차

- [인증](#-인증)
- [공통 응답 형식](#-공통-응답-형식)
- [분실물 API](#-분실물-api-lost-items)
- [습득물 API](#-습득물-api-found-items)
- [헬스체크 API](#-헬스체크-api)
- [에러 코드](#-에러-코드)
- [CORS 설정](#-cors-설정)

---

## 🔐 인증

**현재 상태**: API 보안 비활성화 (`API_SECURITY_ENABLED=false`)

모든 엔드포인트는 현재 인증 없이 접근 가능합니다.

**향후 보안 활성화 시**:

- 헤더 이름: `X-API-KEY`
- 헤더 값: 서버 설정 API 키
- 제외 경로: `/api/health`, `/actuator/**`, `/swagger-ui/**`, `/v3/api-docs/**`

---

## 📦 공통 응답 형식

### ApiResponse 구조

**성공 응답** (페이징 없음):

```json
{
  "success": true,
  "message": "Success" | "사용자 정의 메시지",
  "data": { /* 단일 객체 또는 배열 */ }
}
```

**성공 응답** (페이징 포함):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 데이터 배열 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 114449,
  "totalPages": 5723
}
```

**에러 응답**:

```json
{
  "success": false,
  "message": "에러 메시지",
  "data": null
}
```

### 페이징 파라미터 (공통)

| 파라미터 | 타입 | 기본값 | 최소/최대        | 설명                     |
| -------- | ---- | ------ | ---------------- | ------------------------ |
| `page`   | int  | 0      | min: 0           | 페이지 번호 (0부터 시작) |
| `size`   | int  | 20     | min: 1, max: 100 | 페이지당 항목 수         |

---

## 📍 분실물 API (Lost Items)

### 1. 전체 분실물 조회

**요청**:

```http
GET /api/lost-items?page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "atcId": "L2025092600000040",
      "prdtClNm": "지갑 > 남성용 지갑",
      "lstPlace": "맥도날드 동인천점 또는 그 주변 길가",
      "lstYmd": "2025-09-24",
      "rnum": "1"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 114449,
  "totalPages": 5723
}
```

---

### 2. 분실물 상세 조회

**요청**:

```http
GET /api/lost-items/{atcId}
```

**Path Parameter**:

- `atcId` (string, required): 분실물 관리 ID (예: `L2025092600000040`)

**응답** (200 OK):

```json
{
  "atcId": "L2025092600000040",
  "prdtClNm": "지갑 > 남성용 지갑",
  "lstPlace": "맥도날드 동인천점 또는 그 주변 길가",
  "lstYmd": "2025-09-24",
  "rnum": "1"
}
```

**응답** (404 Not Found):

```json
{
  "success": false,
  "message": "Lost item not found",
  "data": null
}
```

---

### 3. 분실물 등록

**요청**:

```http
POST /api/lost-items
Content-Type: application/json

{
  "atcId": "L2025100100000001",
  "prdtClNm": "휴대폰 > 아이폰",
  "lstPlace": "서울역 2호선 승강장",
  "lstYmd": "2025-10-01",
  "rnum": "1"
}
```

**Request Body**:
| 필드 | 타입 | 필수 | 제약 | 설명 |
|-----|------|------|------|------|
| `atcId` | string | 선택 | - | 분실물 관리 ID (자동 생성 가능) |
| `prdtClNm` | string | **필수** | max: 50 | 물품 분류명 |
| `lstPlace` | string | **필수** | max: 200 | 분실 장소 |
| `lstYmd` | string | **필수** | - | 분실 일자 (YYYY-MM-DD 또는 YYYYMMDD) |
| `rnum` | string | 선택 | - | 결과 순번 |

**응답** (201 Created):

```json
{
  "success": true,
  "message": "Lost item created successfully",
  "data": {
    "atcId": "L2025100100000001",
    "prdtClNm": "휴대폰 > 아이폰",
    "lstPlace": "서울역 2호선 승강장",
    "lstYmd": "2025-10-01",
    "rnum": "1"
  }
}
```

---

### 4. 분실물 수정

**요청**:

```http
PUT /api/lost-items/{atcId}
Content-Type: application/json

{
  "prdtClNm": "휴대폰 > 아이폰 15 Pro",
  "lstPlace": "서울역 2호선 3번 출구",
  "lstYmd": "2025-10-01",
  "rnum": "1"
}
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Lost item updated successfully",
  "data": {
    "atcId": "L2025100100000001",
    "prdtClNm": "휴대폰 > 아이폰 15 Pro",
    "lstPlace": "서울역 2호선 3번 출구",
    "lstYmd": "2025-10-01",
    "rnum": "1"
  }
}
```

---

### 5. 분실물 삭제

**요청**:

```http
DELETE /api/lost-items/{atcId}
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Lost item deleted successfully",
  "data": null
}
```

---

### 6. 물품 분류명으로 조회

**요청**:

```http
GET /api/lost-items/prdt-cl-nm/{prdtClNm}?page=0&size=20
```

**Path Parameter**:

- `prdtClNm` (string, required): 물품 분류명 (예: `지갑`, `휴대폰 > 아이폰`)

**예시**:

```http
GET /api/lost-items/prdt-cl-nm/지갑?page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 지갑 분실물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1523,
  "totalPages": 77
}
```

---

### 7. 분실 장소별 조회

**요청**:

```http
GET /api/lost-items/lst-place?lstPlace={장소}&page=0&size=20
```

**Query Parameters**:

- `lstPlace` (string, required): 분실 장소 (부분 일치 검색)
- `page`, `size`: 페이징 파라미터

**예시**:

```http
GET /api/lost-items/lst-place?lstPlace=서울역&page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 서울역 관련 분실물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 89,
  "totalPages": 5
}
```

---

### 8. 키워드 검색

**요청**:

```http
GET /api/lost-items/search?keyword={검색어}&page=0&size=20
```

**Query Parameters**:

- `keyword` (string, required): 검색 키워드 (물품명, 장소, 분류명, 상세 내용 검색)
- `page`, `size`: 페이징 파라미터

**검색 대상 필드**:

- `prdtClNm` (물품 분류명)
- `lstPlace` (분실 장소)

**예시**:

```http
GET /api/lost-items/search?keyword=아이폰&page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 아이폰 관련 분실물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 342,
  "totalPages": 18
}
```

---

### 9. 최근 분실물 조회

**요청**:

```http
GET /api/lost-items/recent?prdtClNm={분류명}&days=7&page=0&size=20
```

**Query Parameters**:

- `prdtClNm` (string, required): 물품 분류명
- `days` (int, optional): 조회할 일수 (기본: 7, 최소: 1, 최대: 30)
- `page`, `size`: 페이징 파라미터

**예시**:

```http
GET /api/lost-items/recent?prdtClNm=지갑&days=14&page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 최근 14일간 지갑 분실물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 156,
  "totalPages": 8
}
```

---

### 10. 분실 일자 범위별 조회

**요청**:

```http
GET /api/lost-items/lst-ymd-range?start={시작일시}&end={종료일시}&page=0&size=20
```

**Query Parameters**:

- `start` (LocalDateTime, required): 시작 일시 (ISO 8601 형식: `yyyy-MM-dd'T'HH:mm:ss`)
- `end` (LocalDateTime, required): 종료 일시 (ISO 8601 형식: `yyyy-MM-dd'T'HH:mm:ss`)
- `page`, `size`: 페이징 파라미터

**예시**:

```http
GET /api/lost-items/lst-ymd-range?start=2025-09-01T00:00:00&end=2025-09-30T23:59:59&page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 9월 분실물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 3421,
  "totalPages": 172
}
```

**응답** (400 Bad Request):

```json
{
  "success": false,
  "message": "시작 일시가 종료 일시보다 이후일 수 없습니다.",
  "data": null
}
```

---

## 🔍 습득물 API (Found Items)

### 1. 전체 습득물 조회

**요청**:

```http
GET /api/found-items?page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "atcId": "F2025092600000115",
      "fdPrdtNm": "여성카드지갑",
      "prdtClNm": "지갑 > 여성용 지갑",
      "depPlace": "덕산지구대",
      "fdYmd": "2025-09-26",
      "fdSbjt": "여성카드지갑(다크레드(진빨강)색)을 습득하여 보관하고 있습니다.",
      "clrNm": "다크레드(진빨강)",
      "fdSn": "1",
      "fdFilePathImg": "https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 160015,
  "totalPages": 8001
}
```

---

### 2. 습득물 상세 조회

**요청**:

```http
GET /api/found-items/{atcId}
```

**Path Parameter**:

- `atcId` (string, required): 습득물 관리 ID (예: `F2025092600000115`)

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "atcId": "F2025092600000115",
    "fdPrdtNm": "여성카드지갑",
    "prdtClNm": "지갑 > 여성용 지갑",
    "depPlace": "덕산지구대",
    "fdYmd": "2025-09-26",
    "fdSbjt": "여성카드지갑(다크레드(진빨강)색)을 습득하여 보관하고 있습니다.",
    "clrNm": "다크레드(진빨강)",
    "fdSn": "1",
    "fdFilePathImg": "https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif"
  }
}
```

**응답** (404 Not Found):

```json
{
  "success": false,
  "message": "Found item not found",
  "data": null
}
```

---

### 3. 습득물 등록

**요청**:

```http
POST /api/found-items
Content-Type: application/json

{
  "atcId": "F2025100100000001",
  "fdPrdtNm": "아이폰 14 Pro",
  "prdtClNm": "휴대폰 > 아이폰",
  "depPlace": "강남역 3번 출구 파출소",
  "fdYmd": "2025-10-01",
  "fdSbjt": "강남역 근처에서 아이폰을 습득하였습니다.",
  "clrNm": "블랙",
  "fdSn": "1",
  "fdFilePathImg": "https://example.com/image.jpg"
}
```

**Request Body**:
| 필드 | 타입 | 필수 | 제약 | 설명 |
|-----|------|------|------|------|
| `atcId` | string | 선택 | - | 습득물 관리 ID (자동 생성 가능) |
| `fdPrdtNm` | string | **필수** | max: 100 | 습득물품명 |
| `prdtClNm` | string | **필수** | max: 50 | 물품 분류명 |
| `depPlace` | string | **필수** | max: 200 | 보관 장소 |
| `fdYmd` | string | 선택 | max: 10 | 습득 일자 (YYYY-MM-DD 또는 YYYYMMDD) |
| `fdSbjt` | string | 선택 | max: 1000 | 습득물 제목/설명 |
| `clrNm` | string | 선택 | max: 50 | 색상 |
| `fdSn` | string | 선택 | - | 습득 순번 |
| `fdFilePathImg` | string | 선택 | max: 500 | 이미지 URL |

**응답** (201 Created):

```json
{
  "success": true,
  "message": "등록 성공",
  "data": {
    "atcId": "F2025100100000001",
    "fdPrdtNm": "아이폰 14 Pro",
    "prdtClNm": "휴대폰 > 아이폰",
    "depPlace": "강남역 3번 출구 파출소",
    "fdYmd": "2025-10-01",
    "fdSbjt": "강남역 근처에서 아이폰을 습득하였습니다.",
    "clrNm": "블랙",
    "fdSn": "1",
    "fdFilePathImg": "https://example.com/image.jpg"
  }
}
```

---

### 4. 습득물 수정

**요청**:

```http
PUT /api/found-items/{atcId}
Content-Type: application/json

{
  "fdPrdtNm": "아이폰 14 Pro (업데이트)",
  "prdtClNm": "휴대폰 > 아이폰",
  "depPlace": "강남역 3번 출구 파출소",
  "fdYmd": "2025-10-01",
  "fdSbjt": "강남역 근처에서 아이폰을 습득하였습니다. 소유자를 찾습니다.",
  "clrNm": "블랙",
  "fdSn": "1",
  "fdFilePathImg": "https://example.com/image.jpg"
}
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "수정 성공",
  "data": {
    /* 수정된 습득물 데이터 */
  }
}
```

---

### 5. 습득물 삭제

**요청**:

```http
DELETE /api/found-items/{atcId}
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "삭제 성공",
  "data": null
}
```

---

### 6. 카테고리별 습득물 조회

**요청**:

```http
GET /api/found-items/type/{itemType}?page=0&size=20
```

**Path Parameter**:

- `itemType` (string, required): 물품 카테고리 (예: `지갑`, `휴대폰 > 아이폰`)

**예시**:

```http
GET /api/found-items/type/휴대폰?page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 휴대폰 습득물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 2341,
  "totalPages": 118
}
```

---

### 7. 위치별 습득물 조회

**요청**:

```http
GET /api/found-items/location?location={위치}&page=0&size=20
```

**Query Parameters**:

- `location` (string, required): 보관 장소 (부분 일치 검색)
- `page`, `size`: 페이징 파라미터

**예시**:

```http
GET /api/found-items/location?location=강남&page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 강남 지역 습득물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 567,
  "totalPages": 29
}
```

---

### 8. 키워드 검색

**요청**:

```http
GET /api/found-items/search?keyword={검색어}&page=0&size=20
```

**Query Parameters**:

- `keyword` (string, required): 검색 키워드 (물품명, 보관장소, 분류명, 상세설명 검색)
- `page`, `size`: 페이징 파라미터

**검색 대상 필드**:

- `fdPrdtNm` (습득물품명)
- `prdtClNm` (물품 분류명)
- `depPlace` (보관 장소)
- `fdSbjt` (습득물 설명)

**예시**:

```http
GET /api/found-items/search?keyword=아이폰&page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 아이폰 관련 습득물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 876,
  "totalPages": 44
}
```

---

### 9. 최근 습득물 조회

**요청**:

```http
GET /api/found-items/recent?itemType={카테고리}&days=7&page=0&size=20
```

**Query Parameters**:

- `itemType` (string, required): 물품 카테고리
- `days` (int, optional): 조회할 일수 (기본: 7, 최소: 1, 최대: 30)
- `page`, `size`: 페이징 파라미터

**예시**:

```http
GET /api/found-items/recent?itemType=지갑&days=14&page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 최근 14일간 지갑 습득물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 234,
  "totalPages": 12
}
```

---

### 10. 날짜 범위별 습득물 조회

**요청**:

```http
GET /api/found-items/date-range?start={시작일시}&end={종료일시}&page=0&size=20
```

**Query Parameters**:

- `start` (LocalDateTime, required): 시작 일시 (ISO 8601 형식: `yyyy-MM-dd'T'HH:mm:ss`)
- `end` (LocalDateTime, required): 종료 일시 (ISO 8601 형식: `yyyy-MM-dd'T'HH:mm:ss`)
- `page`, `size`: 페이징 파라미터

**예시**:

```http
GET /api/found-items/date-range?start=2025-09-01T00:00:00&end=2025-09-30T23:59:59&page=0&size=20
```

**응답** (200 OK):

```json
{
  "success": true,
  "message": "Success",
  "data": [
    /* 9월 습득물 목록 */
  ],
  "page": 0,
  "size": 20,
  "totalElements": 4567,
  "totalPages": 229
}
```

**응답** (400 Bad Request):

```json
{
  "success": false,
  "message": "시작 날짜가 종료 날짜보다 이후일 수 없습니다.",
  "data": null
}
```

---

## 💊 헬스체크 API

### 헬스체크

**요청**:

```http
GET /api/health
```

**응답** (200 OK):

```json
{
  "database": "Connected",
  "database_check": 1,
  "service": "FindIt Server",
  "status": "UP",
  "timestamp": 1760451453349
}
```

**응답** (503 Service Unavailable):

```json
{
  "database": "Disconnected",
  "database_check": 0,
  "service": "FindIt Server",
  "status": "DOWN",
  "timestamp": 1760451453349
}
```

---

## ⚠️ 에러 코드

| HTTP 상태 코드 | 설명                  | 예시 메시지                                   |
| -------------- | --------------------- | --------------------------------------------- |
| 200            | 성공                  | Success                                       |
| 201            | 생성 성공             | Lost item created successfully                |
| 400            | 잘못된 요청           | 시작 일시가 종료 일시보다 이후일 수 없습니다. |
| 404            | 리소스를 찾을 수 없음 | Lost item not found                           |
| 500            | 서버 내부 오류        | Internal server error                         |

---

## 🌐 CORS 설정

**현재 설정**:

- 모든 Origin 허용 (`*`)
- 허용 메서드: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
- 허용 헤더: 모든 헤더 (`*`)
- Credentials: `false`

**프론트엔드 연동 시 참고사항**:

1. CORS는 서버에서 이미 설정되어 있으므로 별도 설정 불필요
2. `fetch` 또는 `axios` 사용 시 정상 작동
3. 인증이 필요한 경우 `X-API-KEY` 헤더 추가 필요 (현재는 비활성화)

---

## 📊 데이터 통계

**현재 데이터베이스**:

- 분실물: 114,449건
- 습득물: 160,015건
- 총: 274,464건

---

## 🔗 추가 리소스

- **Swagger UI**: `http://43.201.73.176:8080/swagger-ui.html`
- **API Docs (OpenAPI)**: `http://43.201.73.176:8080/api-docs`
- **Actuator Health**: `http://43.201.73.176:8080/actuator/health`
- **Prometheus Metrics**: `http://43.201.73.176:8080/actuator/prometheus`

---

## 📝 프론트엔드 연동 예시

### JavaScript (Fetch API)

```javascript
// 분실물 전체 조회
fetch('http://43.201.73.176:8080/api/lost-items?page=0&size=20')
  .then((response) => response.json())
  .then((data) => {
    console.log('총 분실물:', data.totalElements);
    console.log('분실물 목록:', data.data);
  })
  .catch((error) => console.error('Error:', error));

// 키워드 검색
const keyword = '아이폰';
fetch(
  `http://43.201.73.176:8080/api/lost-items/search?keyword=${encodeURIComponent(keyword)}&page=0&size=20`
)
  .then((response) => response.json())
  .then((data) => {
    console.log('검색 결과:', data.data);
  });
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://43.201.73.176:8080/api';

// 습득물 조회
async function getFoundItems(page = 0, size = 20) {
  try {
    const response = await axios.get(`${API_BASE_URL}/found-items`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    throw error;
  }
}

// 사용 예시
getFoundItems(0, 10).then((data) => {
  console.log('습득물 목록:', data.data);
  console.log('총 페이지:', data.totalPages);
});
```

### React Hook 예시

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function useLostItems(page = 0, size = 20) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://43.201.73.176:8080/api/lost-items',
          {
            params: { page, size }
          }
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size]);

  return { data, loading, error };
}

// 컴포넌트에서 사용
function LostItemsList() {
  const { data, loading, error } = useLostItems(0, 20);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;

  return (
    <div>
      <h1>분실물 목록 (총 {data.totalElements}건)</h1>
      <ul>
        {data.data.map((item) => (
          <li key={item.atcId}>
            {item.prdtClNm} - {item.lstPlace}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🚨 프론트엔드 문제 해결 가이드

### 1. CORS 에러가 발생하는 경우

**증상**: `Access-Control-Allow-Origin` 에러
**원인**: 서버 CORS 설정 문제 (현재는 설정되어 있음)
**확인**: 브라우저 개발자 도구 Network 탭에서 `Preflight` 요청 확인

### 2. API 응답을 받지 못하는 경우

**체크리스트**:

- [ ] 올바른 Base URL 사용 (`http://43.201.73.176:8080/api`)
- [ ] 네트워크 연결 확인
- [ ] 브라우저 콘솔에서 에러 메시지 확인
- [ ] API 서버 상태 확인 (`/api/health`)

### 3. 페이징이 작동하지 않는 경우

**확인사항**:

- `page`는 0부터 시작 (첫 페이지 = 0)
- `size`는 1~100 사이 값
- `totalPages` 값을 확인하여 올바른 페이지 범위 사용

### 4. 검색 결과가 나오지 않는 경우

**확인사항**:

- 한글 키워드는 `encodeURIComponent()` 사용
- 검색어 최소 길이 확인
- 정확한 엔드포인트 사용 (`/search?keyword=...`)

### 5. 날짜 형식 오류

**올바른 형식**:

- 분실일자/습득일자: `2025-10-01` 또는 `20251001`
- 날짜 범위 조회: `2025-10-01T00:00:00` (ISO 8601)

---

**문서 끝** - 최종 업데이트: 2025-10-15
