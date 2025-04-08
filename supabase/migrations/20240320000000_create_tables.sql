-- 필요한 확장 프로그램 설치
CREATE EXTENSION IF NOT EXISTS "pg_net";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- get_list 테이블 생성
CREATE TABLE IF NOT EXISTS get_list (
  id SERIAL PRIMARY KEY,
  atc_id TEXT UNIQUE NOT NULL,
  fd_prdt_nm TEXT,
  fd_file_path_img TEXT,
  fd_ymd TEXT,
  dep_place TEXT,
  fd_sbjt TEXT,
  fd_sn TEXT,
  prdt_cl_nm TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- sync_status 테이블 생성
CREATE TABLE IF NOT EXISTS sync_status (
  id SERIAL PRIMARY KEY,
  type TEXT UNIQUE NOT NULL,
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  status TEXT,
  items_count INTEGER,
  error_message TEXT
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_get_list_atc_id ON get_list(atc_id);
CREATE INDEX IF NOT EXISTS idx_get_list_fd_ymd ON get_list(fd_ymd);
CREATE INDEX IF NOT EXISTS idx_get_list_fd_prdt_nm ON get_list USING gin(fd_prdt_nm gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_get_list_fd_sbjt ON get_list USING gin(fd_sbjt gin_trgm_ops);

-- 자동 업데이트 트리거 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_get_list_updated_at
    BEFORE UPDATE ON get_list
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 