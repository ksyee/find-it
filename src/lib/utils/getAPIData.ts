import { AllData, DetailData } from '@/types/types';
import { parseXmlTextToJson, processXmlResponse } from '@/lib/utils/xmlToJson';

// 공통으로 사용되는 기본 옵션 타입
interface BaseSearchOptions {
  pageNo?: number;
  numOfRows?: number;
  START_YMD?: string;
  END_YMD?: string;
}

// 습득물 검색 옵션
export interface SearchFindOptions extends BaseSearchOptions {
  PRDT_CL_CD_01?: string;
  PRDT_CL_CD_02?: string;
  N_FD_LCT_CD?: string;
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
  timeoutMs: number = 60000 // 기본 60초 타임아웃으로 늘림
): Promise<Response> => {
  const timeoutPromise = new Promise<Response>((_, reject) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error(`API 요청 시간 초과: ${timeoutMs}ms 이상 소요됨`));
    }, timeoutMs);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
};

// getAllData 함수 수정
export const getAllData = async (
  options: {
    pageNo?: number;
    numOfRows?: number;
  } = {}
): Promise<AllData[]> => {
  try {
    const { pageNo = 1, numOfRows = 10 } = options;

    // 공공 API URL 구성
    const url = new URL(import.meta.env.VITE_GETITEMS_ALL_API || '');

    // 서비스 키는 이미 인코딩되어 있으므로 직접 URL에 추가
    const apiKey = import.meta.env.VITE_PUBLICINFO_API_KEY_ENC || '';
    const urlWithKey =
      url.toString() +
      (url.toString().includes('?') ? '&' : '?') +
      'serviceKey=' +
      apiKey;
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

    // 결과를 AllData 타입으로 변환
    const typedResult: AllData[] = items.map((item: any) => {
      return {
        atcId: item.atcId || '',
        fdPrdtNm: item.fdPrdtNm || '',
        fdFilePathImg: item.fdFilePathImg || '',
        fdYmd: item.fdYmd || '',
        depPlace: item.depPlace || '',
        fdSbjt: item.fdSbjt || '',
        fdSn: item.fdSn || '',
        prdtClNm: item.prdtClNm || '',
        rnum: item.rnum || '',
        lstYmd: '',
        lstPlace: '',
        lstPrdtNm: '',
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
 * 습득물 상세 검색
 */
export const getSearchFindData = async (
  options: SearchFindOptions = {}
): Promise<ApiResponse<AllData>> => {
  try {
    const {
      PRDT_CL_CD_01,
      PRDT_CL_CD_02,
      N_FD_LCT_CD,
      pageNo = 1,
      numOfRows = 10,
      START_YMD,
      END_YMD,
    } = options;

    // 공공 API URL 구성
    const url = new URL(
      import.meta.env.VITE_GETITEMS_SEARCH_API ||
        'https://apis.data.go.kr/1320000/LosfundInfoInqireService/getLosfundInfoAccTpNmCstdyPlace'
    );

    // 서비스 키는 이미 인코딩되어 있으므로 직접 URL에 추가
    const apiKey = import.meta.env.VITE_PUBLICINFO_API_KEY_ENC || '';
    const urlWithKey =
      url.toString() +
      (url.toString().includes('?') ? '&' : '?') +
      'serviceKey=' +
      apiKey;
    const urlWithParams = new URL(urlWithKey);

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

    if (N_FD_LCT_CD && N_FD_LCT_CD !== '0') {
      urlWithParams.searchParams.append('N_FD_LCT_CD', N_FD_LCT_CD);
    }

    if (START_YMD) {
      urlWithParams.searchParams.append('START_YMD', START_YMD);
    }

    if (END_YMD) {
      urlWithParams.searchParams.append('END_YMD', END_YMD);
    }

    // API 호출
    const response = await fetchWithTimeout(
      fetch(urlWithParams.toString()),
      60000
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const xmlText = await response.text();
    const parsed = await processXmlResponse(xmlText);

    if (!parsed) {
      return createEmptyResponse(pageNo);
    }

    // 결과를 AllData 타입으로 변환
    const typedItems: AllData[] = parsed.items.map((item: any) => {
      return {
        atcId: item.atcId || '',
        fdPrdtNm: item.fdPrdtNm || '',
        fdFilePathImg: item.fdFilePathImg || '',
        fdYmd: item.fdYmd || '',
        depPlace: item.depPlace || '',
        fdSbjt: item.fdSbjt || '',
        fdSn: item.fdSn || '',
        prdtClNm: item.prdtClNm || '',
        rnum: item.rnum || '',
        lstYmd: '',
        lstPlace: '',
        lstPrdtNm: '',
      };
    });

    return {
      body: {
        items: {
          item: typedItems,
        },
        totalCount: parsed.totalCount || 0,
        pageNo,
        numOfRows,
      },
    };
  } catch (error) {
    console.error('습득물 상세 검색 오류:', error);
    return createEmptyResponse(1);
  }
};

/**
 * 빈 응답을 생성
 */
function createEmptyResponse(pageNo: number): ApiResponse<any> {
  return {
    body: {
      items: {
        item: [],
      },
      totalCount: 0,
      pageNo,
      numOfRows: 0,
    },
  };
}

/**
 * ID로 상세 정보 조회
 */
export const getSearchId = async (id: string): Promise<DetailData | null> => {
  try {
    // 공공 API URL 구성
    const url = new URL(
      import.meta.env.VITE_GETITEMS_DETAIL_API ||
        'https://apis.data.go.kr/1320000/LosfundInfoInqireService/getLosfundDetailInfo'
    );

    // 서비스 키는 이미 인코딩되어 있으므로 직접 URL에 추가
    const apiKey = import.meta.env.VITE_PUBLICINFO_API_KEY_ENC || '';
    const urlWithKey =
      url.toString() +
      (url.toString().includes('?') ? '&' : '?') +
      'serviceKey=' +
      apiKey;
    const urlWithParams = new URL(urlWithKey);

    urlWithParams.searchParams.append('_type', 'xml');
    urlWithParams.searchParams.append('ATC_ID', id);

    // API 호출 (타임아웃 적용)
    const response = await fetchWithTimeout(
      fetch(urlWithParams.toString()),
      20000
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const xmlText = await response.text();
    const result = await parseXmlTextToJson(xmlText);

    // API 응답 구조에 맞게 데이터 추출
    const item = result?.response?.body?.item;

    if (!item) {
      throw new Error('데이터를 찾을 수 없습니다.');
    }

    const detailData = {
      id: item.atcId || '',
      item_name: item.fdPrdtNm || '',
      image: item.fdFilePathImg || '',
      place: item.depPlace || '',
      date: item.fdYmd || '',
      item_type: item.prdtClNm || '',
      description: item.fdSbjt || '',
      storage: item.depPlace || '',
      contact: item.tel || '',
    };

    return detailData;
  } catch (error) {
    console.error('상세 정보 조회 오류:', error);
    return null;
  }
};

/**
 * 분실물 상세 검색
 */
export const getSearchLostData = async (
  options: SearchLostOptions = {}
): Promise<ApiResponse<any>> => {
  try {
    const {
      PRDT_CL_CD_01,
      PRDT_CL_CD_02,
      LST_LCT_CD,
      pageNo = 1,
      numOfRows = 10,
      START_YMD,
      END_YMD,
    } = options;

    // 공공 API URL 구성
    const url = new URL(
      import.meta.env.VITE_LOSTITEMS_SEARCH_API ||
        'https://apis.data.go.kr/1320000/LostGoodsInfoInqireService/getLostGoodsInfoAccTpNmCstdyPlace'
    );

    // 서비스 키는 이미 인코딩되어 있으므로 직접 URL에 추가
    const apiKey = import.meta.env.VITE_PUBLICINFO_API_KEY_ENC || '';
    const urlWithKey =
      url.toString() +
      (url.toString().includes('?') ? '&' : '?') +
      'serviceKey=' +
      apiKey;
    const urlWithParams = new URL(urlWithKey);

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

    // API 호출
    const response = await fetchWithTimeout(
      fetch(urlWithParams.toString()),
      20000
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const xmlText = await response.text();
    const parsed = await processXmlResponse(xmlText);

    if (!parsed) {
      return createEmptyResponse(pageNo);
    }

    // 결과 변환
    const typedItems = parsed.items.map((item: any) => {
      return {
        atcId: item.atcId || '',
        lstPlace: item.lstPlace || '',
        lstPrdtNm: item.lstPrdtNm || '',
        lstYmd: item.lstYmd || '',
        lstFilePathImg: item.lstFilePathImg || '',
        lstSbjt: item.lstSbjt || '',
        lstSn: item.lstSn || '',
        prdtClNm: item.prdtClNm || '',
        rnum: item.rnum || '',
      };
    });

    return {
      body: {
        items: {
          item: typedItems,
        },
        totalCount: parsed.totalCount || 0,
        pageNo,
        numOfRows,
      },
    };
  } catch (error) {
    console.error('분실물 상세 검색 오류:', error);
    return createEmptyResponse(1);
  }
};

/**
 * 키워드로 습득물 검색
 */
export const getSearchData = async (query: string): Promise<AllData[]> => {
  try {
    // 공공 API URL 구성
    const url = new URL(
      import.meta.env.VITE_GETITEMS_SEARCH_API ||
        'https://apis.data.go.kr/1320000/LosfundInfoInqireService/getLosfundInfoAccTpNmCstdyPlace'
    );

    // 서비스 키는 이미 인코딩되어 있으므로 직접 URL에 추가
    const apiKey = import.meta.env.VITE_PUBLICINFO_API_KEY_ENC || '';
    const urlWithKey =
      url.toString() +
      (url.toString().includes('?') ? '&' : '?') +
      'serviceKey=' +
      apiKey;
    const urlWithParams = new URL(urlWithKey);

    urlWithParams.searchParams.append('pageNo', '1');
    urlWithParams.searchParams.append('numOfRows', '20');
    urlWithParams.searchParams.append('_type', 'xml');
    urlWithParams.searchParams.append('PRDT_NM', query);

    // API 호출
    const response = await fetchWithTimeout(
      fetch(urlWithParams.toString()),
      20000
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const xmlText = await response.text();
    const parsed = await processXmlResponse(xmlText);

    if (!parsed || !parsed.items) {
      return [];
    }

    // 결과를 AllData 타입으로 변환
    const results = parsed.items.map((item: any) => {
      return {
        atcId: item.atcId || '',
        fdPrdtNm: item.fdPrdtNm || '',
        fdFilePathImg: item.fdFilePathImg || '',
        fdYmd: item.fdYmd || '',
        depPlace: item.depPlace || '',
        fdSbjt: item.fdSbjt || '',
        fdSn: item.fdSn || '',
        prdtClNm: item.prdtClNm || '',
        rnum: item.rnum || '',
        lstYmd: '',
        lstPlace: '',
        lstPrdtNm: '',
      };
    });

    return results;
  } catch (error) {
    console.error('키워드 검색 오류:', error);
    return [];
  }
};
