#!/usr/bin/env node

/**
 * Export accessible PocketBase collections so we can migrate data to Supabase.
 *
 * - 공개 접근이 허용된 컬렉션만 긁어오므로, admin 권한이 필요한 컬렉션은 빈 결과가 남습니다.
 * - 게시글에서 추출한 닉네임을 기반으로 `profiles.json`을 구성해 Supabase용 초기 데이터를 만듭니다.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import PocketBase from 'pocketbase';

const PB_URL = process.env.PB_URL ?? process.env.VITE_PB_API_URL ?? '';

if (!PB_URL) {
  console.error(
    'PB_URL 환경 변수를 설정하세요. 예: PB_URL=https://findit.pockethost.io node scripts/export-pocketbase.mjs'
  );
  process.exit(1);
}

const OUTPUT_DIR = path.resolve(process.cwd(), 'dump');

/** 공개 접근이 허용된 PocketBase 컬렉션 목록 */
const COLLECTIONS = [
  {
    name: 'community',
    // perPage를 크게 주고 getFullList로 모든 데이터를 한 번에 로드
    options: { sort: '-created', perPage: 200 }
  }
  // 필요 시 다른 공개 컬렉션을 여기에 추가하세요.
];

const pb = new PocketBase(PB_URL);

const main = async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const profileMap = new Map(); // nickname -> profile object

  for (const { name, options } of COLLECTIONS) {
    try {
      const items = await pb.collection(name).getFullList(options);
      const filePath = path.join(OUTPUT_DIR, `${name}.json`);
      await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8');
      console.log(`${name}: ${items.length}건 저장 -> ${filePath}`);

      if (name === 'community') {
        for (const item of items) {
          const nickname = item?.nickname;
          if (typeof nickname !== 'string' || nickname.trim() === '') continue;

          const existing = profileMap.get(nickname);
          const created = item?.created ?? null;

          if (!existing) {
            profileMap.set(nickname, {
              nickname,
              avatar_url: '',
              last_seen: created
            });
            continue;
          }

          if (
            created &&
            (!existing.last_seen || new Date(created) > new Date(existing.last_seen))
          ) {
            existing.last_seen = created;
          }
        }
      }
    } catch (error) {
      console.error(`${name} 컬렉션 내보내기 실패:`, error);
    }
  }

  if (profileMap.size > 0) {
    const profilesPath = path.join(OUTPUT_DIR, 'profiles.json');
    const profiles = Array.from(profileMap.values()).sort((a, b) =>
      a.nickname.localeCompare(b.nickname, 'ko')
    );
    await fs.writeFile(profilesPath, JSON.stringify(profiles, null, 2), 'utf8');
    console.log(`profiles: ${profiles.length}건 저장 -> ${profilesPath}`);
  } else {
    console.log('게시글에서 추출한 프로필 데이터가 없습니다.');
  }
};

main().catch((error) => {
  console.error('PocketBase 데이터 내보내기 중 오류 발생:', error);
  process.exit(1);
});
