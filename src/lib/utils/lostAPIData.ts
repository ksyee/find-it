import { xmlToJson, processXmlResponse } from './xmlToJson';
import { DetailData, JsonObject, AllData, LostAllData } from '@/types/types';

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const parseDetailData = (json: JsonObject): Partial<DetailData> | null => {
  const detailKeys: Array<keyof DetailData> = [
    'id',
    'item_name',
    'image',
    'place',
    'date',
    'item_type',
    'description',
    'storage',
    'contact',
  ];

  const result: Partial<DetailData> = {};

  detailKeys.forEach((key) => {
    const value = json[key];
    if (typeof value === 'string') {
      result[key] = value;
    }
  });

  return Object.keys(result).length > 0 ? result : null;
};

// Partial: 모든 속성을 선택적으로 만듦
const isDetailData = (object: Partial<DetailData>): object is DetailData => {
  return (
    typeof object.id === 'string' &&
    typeof object.item_name === 'string' &&
    typeof object.image === 'string' &&
    typeof object.place === 'string' &&
    typeof object.date === 'string' &&
    typeof object.item_type === 'string' &&
    typeof object.description === 'string' &&
    typeof object.storage === 'string' &&
    typeof object.contact === 'string'
  );
};

// 공통으로 사용되는 기본 옵션 타입
interface BaseSearchOptions {
  pageNo?: number;
  numOfRows?: number;
  START_YMD?: string;
  END_YMD?: string;
}

// 분실물 검색 옵션
export interface SearchLostOptions extends BaseSearchOptions {
  PRDT_CL_CD_01?: string;
  PRDT_CL_CD_02?: string;
  LST_LCT_CD?: string;
}

// 기본 API 응답 타입
interface ApiResponse<T> {
  body: {
    items: {
      item: T[];
    };
    totalCount: number;
    pageNo: number;
    numOfRows: number;
  };
}

/**
 * API 요청에 타임아웃을 적용하는 함수
 * @param fetchPromise 원래 fetch 프로미스
 * @param timeoutMs 타임아웃 시간(밀리초)
 */
const fetchWithTimeout = async (
  fetchPromise: Promise<Response>,
  timeoutMs: number = 60000 // 기본 60초 타임아웃
): Promise<Response> => {
  const timeoutPromise = new Promise<Response>((_, reject) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error(`API 요청 시간 초과: ${timeoutMs}ms 이상 소요됨`));
    }, timeoutMs);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
};

/**
 * 전체 분실물 목록을 조회하는 함수
 * @param options 페이지 번호와 행 수 옵션
 * @returns 분실물 데이터 배열
 */
export const lostAllData = async (
  options: {
    pageNo?: number;
    numOfRows?: number;
  } = {}
): Promise<LostAllData[]> => {
  try {
    const { pageNo = 1, numOfRows = 10 } = options;

    // 공공 API URL 구성
    const url = new URL(import.meta.env.VITE_LOSTITEMS_ALL_API || '');

    // 서비스 키는 이미 인코딩되어 있으므로 직접 URL에 추가
    const apiKey = import.meta.env.VITE_PUBLICINFO_API_KEY_ENC || '';
    const urlWithKey = `${url.toString()}${url.toString().includes('?') ? '&' : '?'}serviceKey=${apiKey}`;
    const urlWithParams = new URL(urlWithKey);
    urlWithParams.searchParams.append('pageNo', pageNo.toString());
    urlWithParams.searchParams.append('numOfRows', numOfRows.toString());
    urlWithParams.searchParams.append('_type', 'xml');

    // 디버깅용 전체 URL 출력
    console.log('API 요청 URL:', urlWithParams.toString());

    // API 호출 (타임아웃 적용)
    const response = await fetchWithTimeout(
      fetch(urlWithParams.toString()),
      60000
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const xmlText = await response.text();

    // 디버깅용 응답 출력
    console.log('API 응답 데이터 (처음 200자):', xmlText.substring(0, 200));

    const parsed = await processXmlResponse(xmlText);

    // 파싱 결과 확인
    console.log('파싱된 결과:', parsed ? '성공' : '실패', parsed);

    // API 응답 구조에 맞게 데이터 추출
    const items = parsed?.body?.items?.item || [];

    // 아이템 수 확인
    console.log('추출된 아이템 수:', items.length);
    if (items.length > 0) {
      console.log('첫 번째 아이템 샘플:', items[0]);
    }

    // 결과를 LostAllData 타입으로 변환
    const typedResult: LostAllData[] = items.map((item: any) => {
      return {
        lstFilePathImg: item.lstFilePathImg || '',
        lstPlace: item.lstPlace || '',
        lstPrdtNm: item.lstPrdtNm || '',
        lstSbjt: item.lstSbjt || '',
        lstSn: item.lstSn || '',
        lstYmd: item.lstYmd || '',
        prdtClNm: item.prdtClNm || '',
        rnum: item.rnum || '',
      };
    });

    // 변환 결과 확인
    console.log(
      '변환된 데이터:',
      typedResult.length > 0 ? '성공' : '빈 배열',
      '첫 번째 항목:',
      typedResult[0]
    );

    return typedResult;
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return [];
  }
};

/**
 * 분실물 검색 함수
 * @param query 검색어
 * @param options 검색 옵션
 * @returns 검색된 분실물 데이터 배열
 */
export const lostSearchData = async (
  query: string,
  options: SearchLostOptions = {}
): Promise<LostAllData[]> => {
  try {
    const {
      pageNo = 1,
      numOfRows = 10,
      PRDT_CL_CD_01,
      PRDT_CL_CD_02,
      LST_LCT_CD,
      START_YMD,
      END_YMD,
    } = options;

    // 공공 API URL 구성
    const url = new URL(import.meta.env.VITE_LOSTITEMS_SEARCH_API || '');

    // 서비스 키는 이미 인코딩되어 있으므로 직접 URL에 추가
    const apiKey = import.meta.env.VITE_PUBLICINFO_API_KEY_ENC || '';
    const urlWithKey = `${url.toString()}${url.toString().includes('?') ? '&' : '?'}serviceKey=${apiKey}`;
    const urlWithParams = new URL(urlWithKey);

    // 필수 파라미터 추가
    urlWithParams.searchParams.append('LST_PRDT_NM', query);
    urlWithParams.searchParams.append('pageNo', pageNo.toString());
    urlWithParams.searchParams.append('numOfRows', numOfRows.toString());
    urlWithParams.searchParams.append('_type', 'xml');

    // 선택적 파라미터 추가
    if (PRDT_CL_CD_01 && PRDT_CL_CD_01 !== '0') {
      urlWithParams.searchParams.append('PRDT_CL_CD_01', PRDT_CL_CD_01);
    }
    if (PRDT_CL_CD_02 && PRDT_CL_CD_02 !== '0') {
      urlWithParams.searchParams.append('PRDT_CL_CD_02', PRDT_CL_CD_02);
    }
    if (LST_LCT_CD && LST_LCT_CD !== '0') {
      urlWithParams.searchParams.append('LST_LCT_CD', LST_LCT_CD);
    }
    if (START_YMD) {
      urlWithParams.searchParams.append('START_YMD', START_YMD);
    }
    if (END_YMD) {
      urlWithParams.searchParams.append('END_YMD', END_YMD);
    }

    // 디버깅용 전체 URL 출력
    console.log('API 요청 URL:', urlWithParams.toString());

    // API 호출 (타임아웃 적용)
    const response = await fetchWithTimeout(
      fetch(urlWithParams.toString()),
      60000
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const xmlText = await response.text();
    const parsed = await processXmlResponse(xmlText);
    const items = parsed?.body?.items?.item || [];

    // 결과를 LostAllData 타입으로 변환
    const typedResult: LostAllData[] = items.map((item: any) => {
      return {
        lstFilePathImg: item.lstFilePathImg || '',
        lstPlace: item.lstPlace || '',
        lstPrdtNm: item.lstPrdtNm || '',
        lstSbjt: item.lstSbjt || '',
        lstSn: item.lstSn || '',
        lstYmd: item.lstYmd || '',
        prdtClNm: item.prdtClNm || '',
        rnum: item.rnum || '',
      };
    });

    return typedResult;
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return [];
  }
};

/**
 * 분실물 상세 정보 조회 함수
 * @param id 분실물 ID
 * @returns 분실물 상세 정보
 */
export const lostSearchId = async (id: string): Promise<DetailData | null> => {
  try {
    // 공공 API URL 구성
    const url = new URL(import.meta.env.VITE_LOSTITEMS_DETAIL_API || '');

    // 서비스 키는 이미 인코딩되어 있으므로 직접 URL에 추가
    const apiKey = import.meta.env.VITE_PUBLICINFO_API_KEY_ENC || '';
    const urlWithKey = `${url.toString()}${url.toString().includes('?') ? '&' : '?'}serviceKey=${apiKey}`;
    const urlWithParams = new URL(urlWithKey);

    // 필수 파라미터 추가
    urlWithParams.searchParams.append('ATC_ID', id);
    urlWithParams.searchParams.append('_type', 'xml');

    // API 호출 (타임아웃 적용)
    const response = await fetchWithTimeout(
      fetch(urlWithParams.toString()),
      60000
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const xmlText = await response.text();
    const parsed = await processXmlResponse(xmlText);
    const item = parsed?.body?.items?.item?.[0];

    if (!item) {
      return null;
    }

    // DetailData 형식으로 변환
    const detailData: DetailData = {
      id: item.atcId || '',
      item_name: item.lstPrdtNm || '',
      image: item.lstFilePathImg || '',
      place: item.lstPlace || '',
      date: item.lstYmd || '',
      item_type: item.lstPlaceSeNm || '',
      description: item.lstSbjt || '',
      storage: item.lstLctNm || '',
      contact: item.tel || '',
    };

    return detailData;
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return null;
  }
};
