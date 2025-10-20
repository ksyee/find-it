import { AllData } from '@/types/types';

const DEFAULT_IMAGE =
  'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif';

export interface GetLostItemsResponse {
  success: boolean;
  message?: string;
  data: Array<
    {
      atcId: string;
      prdtClNm: string;
      lstYmd: string;
      lstPlace: string;
      rnum?: string;
    } & Record<string, unknown>
  >;
}

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    ''
  ) ?? 'http://52.79.241.212:8080/api';

const API_SECURITY_KEY = import.meta.env.VITE_API_SECURITY_KEY as
  | string
  | undefined;

export const getLostItems = async (
  page: number = 0,
  size: number = 10
): Promise<AllData[]> => {
  const requestOptions: RequestInit = {};

  if (API_SECURITY_KEY) {
    requestOptions.headers = {
      'X-API-KEY': API_SECURITY_KEY
    };
  }

  const response = await fetch(
    `${API_BASE_URL}/lost-items?page=${page}&size=${size}`,
    requestOptions
  );

  if (!response.ok) {
    throw new Error('분실물 목록을 불러오지 못했습니다.');
  }

  const json = (await response.json()) as GetLostItemsResponse;

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json.message || '분실물 데이터 형식이 올바르지 않습니다.');
  }

  return json.data.map((item) => ({
    atcId: item.atcId,
    depPlace: '',
    fdFilePathImg: DEFAULT_IMAGE,
    fdPrdtNm: '',
    fdSbjt: '',
    fdSn: '',
    fdYmd: '',
    prdtClNm: item.prdtClNm,
    rnum: item.rnum ?? '',
    lstYmd: item.lstYmd,
    lstPlace: item.lstPlace,
    lstPrdtNm: item.prdtClNm
  }));
};
