import { supabase } from '@/lib/supabaseClient';

/**
 * find_items 테이블을 생성하는 SQL 함수
 */
const CREATE_FIND_ITEMS_TABLE = `
CREATE TABLE IF NOT EXISTS find_items (
  id SERIAL PRIMARY KEY,
  atc_id TEXT UNIQUE NOT NULL,
  fd_prdt_nm TEXT,
  fd_file_path_img TEXT,
  fd_ymd TEXT,
  dep_place TEXT,
  fd_sbjt TEXT,
  fd_sn TEXT,
  prdt_cl_nm TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`;

/**
 * sync_status 테이블을 생성하는 SQL 함수
 */
const CREATE_SYNC_STATUS_TABLE = `
CREATE TABLE IF NOT EXISTS sync_status (
  id SERIAL PRIMARY KEY,
  type TEXT UNIQUE NOT NULL,
  last_sync TIMESTAMP DEFAULT NOW(),
  status TEXT,
  items_count INTEGER,
  error_message TEXT
);
`;

/**
 * Supabase 초기 설정을 실행하는 함수
 */
export async function setupSupabase() {
  try {
    console.log('Supabase 초기 설정 시작...');

    // 직접 SQL 실행 (find_items 테이블 생성)
    const { error: findItemsError } = await supabase.rpc('execute_sql', {
      sql_query: CREATE_FIND_ITEMS_TABLE,
    });

    if (findItemsError) {
      console.error('find_items 테이블 생성 실패:', findItemsError);

      // 실패 시 테이블 존재 여부 확인
      const { error: checkError } = await supabase
        .from('find_items')
        .select('id')
        .limit(1);

      if (checkError) {
        console.warn(
          'find_items 테이블이 존재하지 않습니다. 앱 실행에 영향이 있을 수 있습니다.'
        );
      } else {
        console.log('find_items 테이블이 이미 존재합니다.');
      }
    } else {
      console.log('find_items 테이블 생성 성공');
    }

    // 직접 SQL 실행 (sync_status 테이블 생성)
    const { error: syncStatusError } = await supabase.rpc('execute_sql', {
      sql_query: CREATE_SYNC_STATUS_TABLE,
    });

    if (syncStatusError) {
      console.error('sync_status 테이블 생성 실패:', syncStatusError);

      // 실패 시 테이블 존재 여부 확인
      const { error: checkError } = await supabase
        .from('sync_status')
        .select('id')
        .limit(1);

      if (checkError) {
        console.warn(
          'sync_status 테이블이 존재하지 않습니다. 앱 실행에 영향이 있을 수 있습니다.'
        );
      } else {
        console.log('sync_status 테이블이 이미 존재합니다.');
      }
    } else {
      console.log('sync_status 테이블 생성 성공');
    }

    console.log('Supabase 초기 설정 완료');
    return true;
  } catch (error) {
    console.error('Supabase 초기 설정 실패:', error);
    return false;
  }
}
