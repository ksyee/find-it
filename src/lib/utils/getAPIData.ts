import { supabase } from '@/lib/supabaseClient';
import { AllData, DetailData, LostAllData } from '@/types/types';

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
 * 기본 Supabase 쿼리를 구성하는 함수
 */
const createBaseQuery = (options: BaseSearchOptions) => {
  const { START_YMD, END_YMD, pageNo = 1, numOfRows = 10 } = options;

  let query = supabase.from('get_list').select('*');

  // 날짜 범위 필터링
  if (START_YMD) {
    query = query.gte('fd_ymd', START_YMD);
  }

  if (END_YMD) {
    query = query.lte('fd_ymd', END_YMD);
  }

  // 페이지네이션 적용
  return query
    .range((pageNo - 1) * numOfRows, pageNo * numOfRows - 1)
    .order('fd_ymd', { ascending: false });
};

/**
 * 모든 습득물 데이터 조회
 */
export const getAllData = async (
  options: {
    pageNo?: number;
    numOfRows?: number;
  } = {}
): Promise<AllData[]> => {
  try {
    const { pageNo = 1, numOfRows = 50 } = options;
    console.log('Supabase에서 습득물 데이터 조회 시작');

    const { data, error } = await supabase
      .from('get_list')
      .select('*')
      .range((pageNo - 1) * numOfRows, pageNo * numOfRows - 1)
      .order('fd_ymd', { ascending: false });

    if (error) {
      throw error;
    }

    // Supabase 데이터를 AllData 형식으로 변환
    const typedResult: AllData[] = data.map(transformToAllData);
    console.log('처리 결과:', `${typedResult.length}개의 항목 반환됨`);

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
    console.log('Supabase에서 습득물 상세 검색 시작', options);
    const {
      PRDT_CL_CD_01,
      PRDT_CL_CD_02,
      N_FD_LCT_CD,
      pageNo = 1,
      numOfRows = 10,
    } = options;

    let query = createBaseQuery(options);

    // 대분류 필터링
    if (PRDT_CL_CD_01 && PRDT_CL_CD_01 !== '0') {
      query = query.ilike('prdt_cl_nm', `%${PRDT_CL_CD_01}%`);
    }

    // 소분류 필터링
    if (PRDT_CL_CD_02 && PRDT_CL_CD_02 !== '0') {
      query = query.ilike('prdt_cl_nm', `%${PRDT_CL_CD_02}%`);
    }

    // 지역 필터링
    if (N_FD_LCT_CD && N_FD_LCT_CD !== '0') {
      query = query.ilike('dep_place', `%${N_FD_LCT_CD}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // API 응답 형식과 일치하도록 변환
    const items: AllData[] = data.map(transformToAllData);

    return {
      body: {
        items: {
          item: items,
        },
        totalCount: items.length,
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
 * 분실물 상세 검색
 */
export const getSearchLostData = async (
  options: SearchLostOptions = {}
): Promise<ApiResponse<any>> => {
  try {
    console.log('Supabase에서 분실물 상세 검색 시작', options);
    const {
      PRDT_CL_CD_01,
      PRDT_CL_CD_02,
      LST_LCT_CD,
      pageNo = 1,
      numOfRows = 10,
    } = options;

    let query = createBaseQuery(options);

    // 대분류 필터링
    if (PRDT_CL_CD_01 && PRDT_CL_CD_01 !== '0') {
      query = query.ilike('prdt_cl_nm', `%${PRDT_CL_CD_01}%`);
    }

    // 소분류 필터링
    if (PRDT_CL_CD_02 && PRDT_CL_CD_02 !== '0') {
      query = query.ilike('prdt_cl_nm', `%${PRDT_CL_CD_02}%`);
    }

    // 지역 필터링 (분실물에서는 lst_lct_cd 사용)
    if (LST_LCT_CD && LST_LCT_CD !== '0') {
      query = query.ilike('dep_place', `%${LST_LCT_CD}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // API 응답 형식과 일치하도록 변환 (분실물 데이터는 가상으로 생성)
    const items = data.map(transformToLostData);

    return {
      body: {
        items: {
          item: items,
        },
        totalCount: items.length,
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
    console.log('Supabase에서 습득물 키워드 검색 시작:', query);

    const { data, error } = await supabase
      .from('get_list')
      .select('*')
      .or(`fd_prdt_nm.ilike.%${query}%,fd_sbjt.ilike.%${query}%`)
      .order('fd_ymd', { ascending: false });

    if (error) {
      throw error;
    }

    // Supabase 데이터를 AllData 형식으로 변환
    return data.map(transformToAllData);
  } catch (error) {
    console.error('키워드 검색 오류:', error);
    return [];
  }
};

/**
 * ID로 상세 정보 조회
 */
export const getSearchId = async (id: string): Promise<DetailData | null> => {
  try {
    console.log('Supabase에서 상세 정보 조회 시작:', id);

    const { data, error } = await supabase
      .from('get_list')
      .select('*')
      .eq('atc_id', id)
      .single();

    if (error || !data) {
      throw error || new Error('데이터를 찾을 수 없습니다.');
    }

    return {
      id: data.atc_id,
      item_name: data.fd_prdt_nm,
      image: data.fd_file_path_img,
      place: data.dep_place,
      date: data.fd_ymd,
      item_type: data.prdt_cl_nm,
      description: data.fd_sbjt,
      storage: data.dep_place,
      contact: '', // 보안상의 이유로 연락처는 별도 처리 필요
    };
  } catch (error) {
    console.error('상세 정보 조회 오류:', error);
    return null;
  }
};

// 유틸리티 함수들

/**
 * DB 데이터를 AllData 타입으로 변환
 */
function transformToAllData(item: any): AllData {
  return {
    atcId: item.atc_id,
    fdPrdtNm: item.fd_prdt_nm || '',
    fdFilePathImg: item.fd_file_path_img || '',
    fdYmd: item.fd_ymd || '',
    depPlace: item.dep_place || '',
    fdSbjt: item.fd_sbjt || '',
    fdSn: item.fd_sn || '',
    prdtClNm: item.prdt_cl_nm || '',
    rnum: String(item.id),
    lstYmd: '',
    lstPlace: '',
    lstPrdtNm: '',
  };
}

/**
 * DB 데이터를 분실물 데이터로 변환
 */
function transformToLostData(item: any) {
  return {
    atcId: item.atc_id,
    lstPlace: item.dep_place || '',
    lstPrdtNm: item.fd_prdt_nm || '',
    lstYmd: item.fd_ymd || '',
    lstFilePathImg: item.fd_file_path_img || '',
    lstSbjt: item.fd_sbjt || '',
    lstSn: item.fd_sn || '',
    prdtClNm: item.prdt_cl_nm || '',
    rnum: String(item.id),
  };
}

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
