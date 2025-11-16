import { xmlToJson } from '@/lib/utils/xmlToJson';
import { raiseValue } from '@/lib/utils/raiseValue';
import { JsonObject, DetailData, JsonValue } from '@/types/types';
import { logger } from '@/lib/utils/logger';

const DEFAULT_IMAGE =
  'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif';

const resolveApiBaseUrl = () => {
  const envValue = (
    import.meta.env.VITE_API_BASE_URL as string | undefined
  )?.replace(/\/$/, '');
  const base =
    envValue && envValue.length > 0
      ? envValue
      : 'http://52.79.241.212:8080/api';

  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    base.startsWith('http://')
  ) {
    return `${window.location.origin}/api`;
  }

  return base;
};

const API_BASE_URL = resolveApiBaseUrl();

const API_SECURITY_KEY = import.meta.env.VITE_API_SECURITY_KEY as
  | string
  | undefined;

const createAuthorizedRequestOptions = (): RequestInit => {
  if (!API_SECURITY_KEY) {
    return {};
  }

  return {
    headers: {
      'X-API-KEY': API_SECURITY_KEY,
    },
  };
};

interface FoundItemDetailResponse {
  success: boolean;
  message?: string;
  data?:
    | {
        atcId?: string;
        fdPrdtNm?: string;
        prdtClNm?: string;
        depPlace?: string;
        fdPlace?: string;
        fdYmd?: string;
        fdSbjt?: string;
        fdFilePathImg?: string;
        fndKeepOrgnSeNm?: string;
        tel?: string;
      }
    | null;
}

const isJsonObject = (value: unknown): value is JsonObject => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const getAllData = async (options = {}) => {
  try {
    const params = new URLSearchParams(options);

    const response = await fetch(
      `${import.meta.env.VITE_GETITEMS_ALL_API}?serviceKey=${import.meta.env.VITE_PUBLICINFO_API_KEY_INC}&${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('네트워크 응답 없음');
    }

    const data = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'text/xml');
    const json = xmlToJson(xml);

    if (typeof json === 'string') {
      throw new Error('json이 문자열입니다.');
    }

    if (
      isJsonObject(json) &&
      isJsonObject(json.response) &&
      isJsonObject(json.response.body) &&
      isJsonObject(json.response.body.items)
    ) {
      const items = json.response.body.items.item;

      if (!Array.isArray(items)) {
        throw new Error('items의 타입이 배열이 아닙니다.');
      }

      const result = raiseValue(items as JsonValue);

      return result;
    }
  } catch (error) {
    logger.error('getAllData 요청 실패', error);
    return null;
  }
};

export const getSearchData = async (query: string, options = {}) => {
  try {
    const params = new URLSearchParams(options);

    const response = await fetch(
      `${import.meta.env.VITE_GETITEMS_SEARCH_API}?serviceKey=${import.meta.env.VITE_PUBLICINFO_API_KEY_INC}&PRDT_NM=${query}&${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('네트워크 응답 없음');
    }

    const data = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'text/xml');
    const json = xmlToJson(xml);

    if (typeof json === 'string') {
      throw new Error('json이 문자열입니다.');
    }

    if (
      isJsonObject(json) &&
      isJsonObject(json.response) &&
      isJsonObject(json.response.body) &&
      isJsonObject(json.response.body.items)
    ) {
      const result = raiseValue(json.response?.body.items.item as JsonValue);

      return result;
    }
  } catch (error) {
    logger.error('getSearchData 요청 실패', error);
  }
};

export const getSearchId = async (id: string): Promise<DetailData | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/found-items/${id}`,
      createAuthorizedRequestOptions()
    );

    if (!response.ok) {
      throw new Error('네트워크 응답 없음');
    }

    const json = (await response.json()) as FoundItemDetailResponse;

    if (!json.success || !json.data) {
      throw new Error(json.message || '습득물 상세 정보를 불러오지 못했습니다.');
    }

    const item = json.data;

    const detailData: DetailData = {
      id: item.atcId ?? '',
      item_name: item.fdPrdtNm ?? '',
      image:
        item.fdFilePathImg && item.fdFilePathImg !== ''
          ? item.fdFilePathImg
          : DEFAULT_IMAGE,
      place: item.fdPlace ?? item.depPlace ?? '',
      date: item.fdYmd ?? '',
      item_type: item.prdtClNm ?? '',
      description: item.fdSbjt ?? item.fndKeepOrgnSeNm ?? '',
      storage: item.depPlace ?? '',
      contact: item.tel ?? '',
    };

    return detailData;
  } catch (error) {
    logger.error('getSearchId 요청 실패', error);
    return null;
  }
};

export const getSearchFindData = async (query = {}) => {
  try {
    const params = new URLSearchParams(query);

    const response = await fetch(
      `${import.meta.env.VITE_GET_FIND_DATA_CATEGORY_API_URL}?serviceKey=${import.meta.env.VITE_GET_DATA_API_KEY_ENC}&${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('네트워크 응답 없음');
    }

    const data = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'text/xml');
    const json = xmlToJson(xml);

    if (typeof json === 'string') {
      throw new Error('json이 문자열입니다.');
    }

    if (
      isJsonObject(json) &&
      isJsonObject(json.response) &&
      isJsonObject(json.response.body) &&
      isJsonObject(json.response.body.items)
    ) {
      const result = raiseValue(json.response?.body.items.item);

      return result;
    }
  } catch (error) {
    logger.error('getSearchFindData 요청 실패', error);
  }
};

export const getSearchLostData = async (query = {}) => {
  try {
    const params = new URLSearchParams(query);

    const response = await fetch(
      `${import.meta.env.VITE_GET_LOST_DATA_CATEGORY_API_URL}?serviceKey=${import.meta.env.VITE_GET_DATA_API_KEY_ENC}&${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('네트워크 응답 없음');
    }

    const data = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'text/xml');
    const json = xmlToJson(xml);

    if (typeof json === 'string') {
      throw new Error('json이 문자열입니다.');
    }

    if (
      isJsonObject(json) &&
      isJsonObject(json.response) &&
      isJsonObject(json.response.body) &&
      isJsonObject(json.response.body.items)
    ) {
      const result = raiseValue(json.response?.body.items.item);

      return result;
    }
  } catch (error) {
    logger.error('getSearchLostData 요청 실패', error);
  }
};
