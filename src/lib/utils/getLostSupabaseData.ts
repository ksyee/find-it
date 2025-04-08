import { supabase } from '@/lib/supabaseClient';
import { lostAllData } from '@/lib/utils/lostAPIData';
import { syncLostItems } from '@/lib/utils/syncLostItems';
import { LostAllData } from '@/types/types';

/**
 * Supabase에서 분실물 데이터를 가져오는 함수
 * @param options 페이지네이션, 검색 옵션
 * @returns 분실물 데이터 배열
 */
export async function getLostItems(
  options: {
    pageNo?: number;
    numOfRows?: number;
    category?: string;
    keyword?: string;
  } = {}
): Promise<LostAllData[]> {
  try {
    const { pageNo = 1, numOfRows = 10, category, keyword } = options;

    // 페이지네이션 계산
    const startRow = (pageNo - 1) * numOfRows;
    const endRow = startRow + numOfRows - 1;

    console.log(
      `Supabase에서 분실물 데이터 조회 (페이지: ${pageNo}, 행 수: ${numOfRows})`
    );

    // Supabase 쿼리 구성
    let query = supabase
      .from('lost_list')
      .select('*')
      .order('date', { ascending: false });

    // 필터 적용
    if (category) {
      query = query.ilike('item_type_a', `%${category}%`);
    }

    if (keyword) {
      query = query.or(
        `item_name.ilike.%${keyword}%,content.ilike.%${keyword}%`
      );
    }

    // 페이지네이션 적용
    query = query.range(startRow, endRow);

    // 데이터 가져오기
    const { data, error } = await query;

    if (error) {
      console.error('Supabase 쿼리 오류:', error);
      throw error;
    }

    // Supabase에 데이터가 없는 경우 (최초 또는 동기화 필요)
    if (!data || data.length === 0) {
      console.log(
        'Supabase에 분실물 데이터가 없습니다. 동기화를 시도합니다...'
      );

      // 데이터 동기화 시도
      const syncResult = await syncLostItems(100);

      if (syncResult.success) {
        // 동기화 성공 후 다시 쿼리
        const { data: refreshedData, error: refreshError } = await query;

        if (refreshError) {
          console.error('동기화 후 분실물 데이터 조회 오류:', refreshError);
          throw refreshError;
        }

        if (refreshedData && refreshedData.length > 0) {
          console.log(
            `동기화 후 Supabase에서 ${refreshedData.length}개 분실물 항목 조회 성공`
          );
          return transformToLostData(refreshedData);
        }
      }

      // 동기화 실패 또는 동기화 후에도 데이터가 없는 경우 API에서 직접 가져오기
      console.log(
        'Supabase 동기화 후에도 분실물 데이터가 없거나 오류가 발생했습니다. API에서 직접 가져옵니다...'
      );
      const apiData = await lostAllData({
        pageNo,
        numOfRows,
        ...(category ? { PRDT_CL_CD_01: category } : {}),
      });

      if (apiData && Array.isArray(apiData)) {
        return apiData;
      }

      return [];
    }

    console.log(`Supabase에서 ${data.length}개 분실물 항목 조회 성공`);
    return transformToLostData(data);
  } catch (error) {
    console.error('Supabase에서 분실물 데이터 가져오기 실패:', error);
    // Supabase 오류 발생 시 API에서 직접 가져오기 시도
    const apiData = await lostAllData(options);
    if (apiData && Array.isArray(apiData)) {
      return apiData;
    }
    return [];
  }
}

/**
 * Supabase 데이터 형식을 API 형식으로 변환
 */
function transformToLostData(data: any[]): LostAllData[] {
  return data.map((item) => ({
    atcId: item.atc_id,
    lstPrdtNm: item.item_name,
    lstFilePathImg: item.image,
    lstYmd: item.date,
    lstPlace: item.place,
    lstSbjt: item.content,
    lstSn: item.mgmt_num,
    prdtClNm: item.item_type_a,
    rnum: String(item.id || '0'),
  }));
}

/**
 * 마지막 분실물 동기화 시간을 확인하고 필요시 동기화를 수행
 */
export async function checkAndSyncLostData() {
  try {
    const { data } = await supabase
      .from('sync_status')
      .select('last_sync, status')
      .eq('type', 'lost_list')
      .single();

    if (!data) {
      // 동기화 기록이 없으면 최초 동기화 수행
      console.log('분실물 동기화 기록이 없습니다. 최초 동기화를 시작합니다...');
      return await syncLostItems(100);
    }

    const lastSync = new Date(data.last_sync);
    const now = new Date();
    const diffHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

    // 마지막 동기화가 2시간 이상 지났거나 실패한 경우
    if (diffHours > 2 || data.status !== 'success') {
      console.log(
        `마지막 분실물 동기화로부터 ${diffHours.toFixed(1)}시간 경과. 동기화를 시작합니다...`
      );
      return await syncLostItems(100);
    }

    console.log(
      `마지막 분실물 동기화: ${lastSync.toLocaleString()} (${diffHours.toFixed(1)}시간 전)`
    );
    return { success: true, message: '최근에 동기화됨' };
  } catch (error) {
    console.error('분실물 동기화 상태 확인 실패:', error);
    return { success: false, error };
  }
}
