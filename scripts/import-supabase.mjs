#!/usr/bin/env node

/**
 * Import PocketBase dump data into Supabase tables via REST API.
 *
 * 환경 변수:
 *   SUPABASE_URL                예: https://xyzcompany.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY   (권장) 서비스 키. 없으면 SUPABASE_ANON_KEY로 대체하지만,
 *                               RLS 정책 때문에 실패할 수 있습니다.
 *   SUPABASE_ANON_KEY           (옵션) 익명 키. 위 키가 없을 때만 사용.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    'SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY (또는 SUPABASE_ANON_KEY)를 환경 변수로 설정하세요.'
  );
  process.exit(1);
}

const API_BASE_URL = new URL('/rest/v1/', SUPABASE_URL).toString();
const DUMP_DIR = path.resolve(process.cwd(), 'dump');

const loadJsonArray = async (fileName) => {
  const filePath = path.join(DUMP_DIR, `${fileName}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error(`${fileName}.json is not an array`);
    }
    return parsed;
  } catch (error) {
    console.error(`${fileName}.json 읽기 실패:`, error.message);
    return [];
  }
};

const upsert = async (table, rows, searchParam = '') => {
  if (rows.length === 0) return;

  const url = new URL(table + searchParam, API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify(rows)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${table} upsert 실패: ${response.status} ${response.statusText} - ${text}`);
  }
};

const transformCommunity = (items) =>
  items.map((item) => ({
    legacy_id: item.id ?? null,
    title: item.title ?? '',
    content: item.content ?? '',
    tag: item.tag ?? null,
    author_nickname: item.nickname ?? '익명',
    created_at: item.created ?? null,
    updated_at: item.updated ?? item.created ?? null
  }));

const main = async () => {
  const profiles = await loadJsonArray('profiles');
  if (profiles.length > 0) {
    await upsert('profiles', profiles, '?on_conflict=nickname');
    console.log(`profiles ${profiles.length}건 업서트 완료`);
  } else {
    console.log('profiles 데이터 없음');
  }

  const communityDump = await loadJsonArray('community');
  if (communityDump.length > 0) {
    const transformed = transformCommunity(communityDump);
    await upsert('community', transformed, '?on_conflict=legacy_id');
    console.log(`community ${transformed.length}건 업서트 완료`);
  } else {
    console.log('community 데이터 없음');
  }
};

main().catch((error) => {
  console.error('Supabase import 중 오류:', error);
  process.exit(1);
});
