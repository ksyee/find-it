import { AllData } from '@/types/types';

/**
 * 새 JSON 서버에서 습득물 목록을 가져오는 함수
 * @param page 0부터 시작하는 페이지 번호
 * @param size 페이지 당 항목 수 (기본 10)
 */
export const getFoundItems = async (
  page: number = 0,
  size: number = 10
): Promise<AllData[]> => {
  try {
    const response = await fetch(
      `https://findit-server.ksyee.dev/api/found-items?page=${page}&size=${size}`
    );

    if (!response.ok) {
      throw new Error('네트워크 응답 없음');
    }

    const json = await response.json();

    if (!json.success || !Array.isArray(json.data)) {
      throw new Error(json.message || 'API 실패');
    }

    const defaultImg =
      'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif';

    const data: AllData[] = json.data.map((item: any) => ({
      atcId: item.atcId,
      depPlace: item.depPlace,
      fdFilePathImg: item.fdFilePathImg && item.fdFilePathImg !== '' ? item.fdFilePathImg : defaultImg,
      fdPrdtNm: item.fdPrdtNm,
      fdSbjt: item.fdSbjt,
      fdSn: item.fdSn ?? '',
      fdYmd: item.fdYmd,
      prdtClNm: item.prdtClNm,
      rnum: '',
      lstYmd: '',
      lstPlace: '',
      lstPrdtNm: ''
    }));

    return data;
  } catch (error) {
    console.error('getFoundItems error:', error);
    return [];
  }
};
