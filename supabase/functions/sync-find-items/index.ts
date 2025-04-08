// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

console.log('Hello from Functions!');

/**
 * CORS 헤더 설정
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

/**
 * 습득물 항목 타입 정의
 */
interface GetListItem {
  atcId: string;
  fdPrdtNm: string;
  fdFilePathImg: string;
  fdYmd: string;
  depPlace: string;
  fdSbjt: string;
  fdSn: string;
  prdtClNm: string;
}

/**
 * 공공 API에서 습득물 데이터를 가져오는 함수
 * @param apiKey - 공공 데이터 포털 API 키
 * @param pageNo - 페이지 번호
 * @param numOfRows - 한 페이지당 결과 수
 * @returns 습득물 항목 배열
 */
async function fetchGetListItems(
  apiKey: string,
  pageNo = 1,
  numOfRows = 100
): Promise<GetListItem[]> {
  try {
    // 공공 데이터 포털 API URL 생성
    const url = `https://apis.data.go.kr/1320000/LosfundInfoInqireService/getLosfundInfoAccToClAreaPd?serviceKey=${apiKey}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

    // API 요청 및 응답 확인
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    // XML 응답을 파싱
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const jsonData = xmlToJson(xml.documentElement);

    // 응답에서 항목 추출
    const items = jsonData.response?.body?.items?.item || [];
    return Array.isArray(items) ? items : [items];
  } catch (error) {
    console.error('공공 API 호출 오류:', error);
    return [];
  }
}

/**
 * XML을 JSON으로 변환하는 함수
 * @param xml - XML 요소
 * @returns JSON 객체
 */
function xmlToJson(xml: Element): any {
  const obj: any = {};

  // 요소 노드 처리
  if (xml.nodeType === 1) {
    // 속성 처리
    if (xml.attributes.length > 0) {
      for (let i = 0; i < xml.attributes.length; i++) {
        const attribute = xml.attributes[i];
        obj[attribute.nodeName] = attribute.nodeValue;
      }
    }
  }
  // 텍스트 노드 처리
  else if (xml.nodeType === 3) {
    obj.textContent = xml.nodeValue;
  }

  // 자식 노드 처리
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes[i];
      const nodeName = item.nodeName;

      // 텍스트 노드가 아닌 경우만 처리
      if (nodeName !== '#text') {
        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = xmlToJson(item as Element);
        } else {
          // 동일한 이름의 노드가 여러 개인 경우 배열로 변환
          if (typeof obj[nodeName].push === 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item as Element));
        }
      }
    }
  }
  return obj;
}

/**
 * HTTP 서버 설정
 */
serve(async (req) => {
  // CORS 프리플라이트 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Supabase 클라이언트 초기화
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // API 키 가져오기
    const apiKey = Deno.env.get('PUBLICINFO_API_KEY_ENC');
    if (!apiKey) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }

    // 공공 API에서 데이터 가져오기
    const items = await fetchGetListItems(apiKey);

    if (items.length === 0) {
      throw new Error('데이터를 가져오지 못했습니다.');
    }

    // Supabase에 데이터 저장
    const { error } = await supabaseClient.from('get_list').upsert(
      items.map((item) => ({
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
      })),
      { onConflict: 'atc_id' }
    );

    if (error) {
      throw error;
    }

    // 동기화 상태 업데이트
    await supabaseClient.from('sync_status').upsert(
      {
        type: 'get_list',
        last_sync: new Date().toISOString(),
        status: 'success',
        items_count: items.length,
      },
      { onConflict: 'type' }
    );

    // 성공 응답 반환
    return new Response(
      JSON.stringify({ success: true, count: items.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('동기화 오류:', error);

    // 에러 응답 반환
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sync-find-items' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
