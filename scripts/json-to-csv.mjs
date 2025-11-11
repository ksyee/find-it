#!/usr/bin/env node

/**
 * Convert JSON arrays in dump/*.json to CSV files for manual Supabase import.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DUMP_DIR = path.resolve(process.cwd(), 'dump');

const DATASETS = [
  {
    name: 'profiles',
    columns: ['nickname', 'avatar_url', 'last_seen']
  },
  {
    name: 'community',
    columns: [
      'id',
      'collectionId',
      'collectionName',
      'title',
      'content',
      'tag',
      'nickname',
      'image',
      'created',
      'updated'
    ]
  },
  {
    name: 'community_supabase',
    source: 'community',
    columns: [
      'legacy_id',
      'title',
      'content',
      'tag',
      'author_nickname',
      'created_at',
      'updated_at'
    ],
    transform: (rows) =>
      rows.map((row) => ({
        legacy_id: row.id ?? null,
        title: row.title ?? '',
        content: row.content ?? '',
        tag: row.tag ?? null,
        author_nickname: row.nickname ?? '',
        created_at: row.created ?? null,
        updated_at: row.updated ?? row.created ?? null
      }))
  }
];

const escapeCell = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Wrap in quotes and escape existing quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
};

const toCsv = (rows, columns) => {
  const header = columns.map(escapeCell).join(',');
  const lines = rows.map((row) =>
    columns.map((column) => escapeCell(row[column])).join(',')
  );
  return [header, ...lines].join('\n');
};

const main = async () => {
  await fs.mkdir(DUMP_DIR, { recursive: true });

  for (const { name, source = name, columns, transform } of DATASETS) {
    const jsonPath = path.join(DUMP_DIR, `${source}.json`);
    const csvPath = path.join(DUMP_DIR, `${name}.csv`);

    try {
      const raw = await fs.readFile(jsonPath, 'utf8');
      let data = JSON.parse(raw);

      if (!Array.isArray(data)) {
        console.warn(`${name}.json 은 배열이 아닙니다. 건너뜁니다.`);
        continue;
      }

      if (typeof transform === 'function') {
        data = transform(data);
      }

      const csv = toCsv(data, columns);
      await fs.writeFile(csvPath, csv, 'utf8');
      console.log(`${name}.csv 생성 완료 (${data.length}건) -> ${csvPath}`);
    } catch (error) {
      console.error(`${name} 변환 실패:`, error.message);
    }
  }
};

main().catch((error) => {
  console.error('JSON -> CSV 변환 중 오류:', error);
  process.exit(1);
});
