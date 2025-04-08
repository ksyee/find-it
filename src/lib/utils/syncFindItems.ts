import { supabase } from '@/lib/supabaseClient';
import { getAllData } from '@/lib/utils/getAPIData';
import { AllData } from '@/types/types';

/**
 * 공공 API에서 습득물 데이터를 가져와 Supabase에 저장하는 함수
 * @param batchSize 한 번에 가져올 데이터 수
 * @returns 동기화 결과 객체
 */
export async function syncFindItems(batchSize = 50) {
  try {
    console.log('습득물 데이터 동기화 시작...');

    // 1. 공공 API에서 데이터 가져오기
    const apiData = await getAllData({ pageNo: 1, numOfRows: batchSize });

    if (!Array.isArray(apiData) || apiData.length === 0) {
      console.log('API에서 데이터를 받아오지 못했습니다');
      return { success: false, error: '데이터 없음' };
    }

    console.log(`${apiData.length}개 항목 동기화 중...`);

    // 2. Supabase에 저장할 형식으로 변환
    const transformedData = apiData.map((item) => ({
      atc_id: item.atcId,
      item_name: item.fdPrdtNm || '',
      place: item.depPlace || '',
      date: item.fdYmd || new Date().toISOString().split('T')[0],
      content: item.fdSbjt || '',
      image: item.fdFilePathImg || '',
      storage: '',
      phone: '',
      mgmt_num: item.fdSn || '',
      item_type_a: item.prdtClNm || '',
      item_type_b: '',
      updated_at: new Date().toISOString(),
    }));

    // 3. Supabase에 upsert (중복 키는 업데이트)
    const { error } = await supabase.from('get_list').upsert(transformedData, {
      onConflict: 'atc_id',
      ignoreDuplicates: false,
    });

    if (error) {
      console.error('Supabase 업서트 오류:', error);
      throw error;
    }

    // 4. 동기화 상태 업데이트
    await updateSyncStatus('success', transformedData.length);

    console.log(`습득물 데이터 ${transformedData.length}개 동기화 완료`);
    return { success: true, count: transformedData.length };
  } catch (error) {
    console.error('습득물 데이터 동기화 실패:', error);

    // 실패 상태 기록
    await updateSyncStatus(
      'error',
      0,
      error instanceof Error ? error.message : '알 수 없는 오류'
    );

    return { success: false, error };
  }
}

/**
 * 동기화 상태를 업데이트하는 함수
 */
async function updateSyncStatus(
  status: string,
  count: number,
  errorMessage?: string
) {
  try {
    await supabase.from('sync_status').upsert(
      {
        type: 'get_list',
        last_sync: new Date().toISOString(),
        status,
        items_count: count,
        error_message: errorMessage,
      },
      { onConflict: 'type' }
    );
  } catch (error) {
    console.error('동기화 상태 업데이트 실패:', error);
  }
}
