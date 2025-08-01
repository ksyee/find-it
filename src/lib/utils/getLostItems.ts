import { AllData } from '@/types/types';

/**
 * REST API에서 분실물 목록을 가져오는 함수
 * @param page 0부터 시작하는 페이지 번호
 * @param size 페이지 당 항목 수 (기본 10)
 */
export const getLostItems = async (
  page: number = 0,
  size: number = 10
): Promise<AllData[]> => {
  try {
    const response = await fetch(
      `https://findit-server.ksyee.dev/api/lost-items?page=${page}&size=${size}`
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
      depPlace: '', // 분실물은 보관 장소 정보를 제공하지 않음
      fdFilePathImg: defaultImg, // 이미지 없음 -> 기본 이미지
      fdPrdtNm: '',
      fdSbjt: '',
      fdSn: '',
      fdYmd: '',
      prdtClNm: item.prdtClNm,
      rnum: item.rnum ?? '',
      lstYmd: item.lstYmd,
      lstPlace: item.lstPlace,
      lstPrdtNm: item.prdtClNm, // 품목명을 이름으로 대체
    }));

    return data;
  } catch (error) {
    console.error('getLostItems error:', error);
    return [];
  }
};
