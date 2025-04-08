-- 스케줄러 확장 활성화
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 동기화 함수 생성
CREATE OR REPLACE FUNCTION sync_find_items()
RETURNS void AS $$
BEGIN
  -- Edge Function 호출
  PERFORM net.http_post(
    'https://cmjjijyxaowccxnmowao.supabase.co/functions/v1/sync-find-items',
    '{}',
    'application/json',
    ARRAY[
      ('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))::net.http_header
    ]
  );
END;
$$ LANGUAGE plpgsql;

-- 2시간마다 실행되는 스케줄 생성
SELECT cron.schedule(
  'sync-find-items',
  '0 */2 * * *',  -- 매 2시간마다
  'SELECT sync_find_items()'
); 