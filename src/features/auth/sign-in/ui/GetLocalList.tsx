import { useEffect, useState } from 'react';
import useGetToken from '@/lib/utils/useGetToken';

const DEFAULT_SIDO_LIST = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도'
];

const DEFAULT_SIDO_CODES: Record<string, string> = {
  서울특별시: '11',
  부산광역시: '26',
  대구광역시: '27',
  인천광역시: '28',
  광주광역시: '29',
  대전광역시: '30',
  울산광역시: '31',
  세종특별자치시: '36',
  경기도: '41',
  강원특별자치도: '51',
  충청북도: '43',
  충청남도: '44',
  전북특별자치도: '45',
  전라남도: '46',
  경상북도: '47',
  경상남도: '48',
  제주특별자치도: '50'
};

const DEFAULT_GUNGU_BY_SIDO: Record<string, string[]> = {
  서울특별시: ['강남구', '강서구', '관악구', '송파구', '종로구'],
  부산광역시: ['해운대구', '부산진구', '동래구', '수영구', '남구'],
  대구광역시: ['중구', '수성구', '달서구', '남구', '북구'],
  인천광역시: ['연수구', '남동구', '부평구', '중구', '미추홀구'],
  광주광역시: ['동구', '서구', '남구', '북구', '광산구'],
  대전광역시: ['중구', '서구', '유성구', '대덕구', '동구'],
  울산광역시: ['남구', '중구', '북구', '동구', '울주군'],
  세종특별자치시: ['세종시'],
  경기도: ['수원시', '성남시', '용인시', '고양시', '부천시'],
  강원특별자치도: ['춘천시', '원주시', '강릉시', '동해시', '속초시'],
  충청북도: ['청주시', '충주시', '제천시', '음성군', '진천군'],
  충청남도: ['천안시', '공주시', '아산시', '서산시', '논산시'],
  전북특별자치도: ['전주시', '군산시', '익산시', '정읍시', '남원시'],
  전라남도: ['목포시', '여수시', '순천시', '나주시', '광양시'],
  경상북도: ['포항시', '경주시', '구미시', '김천시', '안동시'],
  경상남도: ['창원시', '김해시', '양산시', '진주시', '거제시'],
  제주특별자치도: ['제주시', '서귀포시']
};

/* -------------------------------------------------------------------------- */
// 타입 정의
interface AddressData {
  result: { addr_name: string; cd: number }[];
}
/* -------------------------------------------------------------------------- */
// 시도 리스트
export const GetSidoList = () => {
  const accessToken = useGetToken();
  const [localList, setLocalList] = useState<string[]>(DEFAULT_SIDO_LIST);
  const baseUrl = import.meta.env.VITE_LOCAL_API_URL;

  useEffect(() => {
    const getLocalList = async () => {
      if (!accessToken || !baseUrl) return;

      const SIDOURL = `${baseUrl}?accessToken=${accessToken}`;

      try {
        const response = await fetch(SIDOURL);

        if (!response.ok) {
          throw new Error('시/도 목록을 불러오는데 실패했습니다.');
        }
        const jsonData: AddressData = await response.json();
        const items = jsonData.result; // 최종 데이터
        const nameList = items.map((item) => item.addr_name);
        if (nameList.length > 0) {
          setLocalList(nameList);
        }
      } catch (error) {
        console.error('시도 리스트 뿌리기 에러남: ' + error);
      }
    };
    getLocalList();
  }, [accessToken, baseUrl]);
  return localList;
};

/* -------------------------------------------------------------------------- */
// 시도 코드 가져오기

export const GetCode = (addrName: string) => {
  const accessToken = useGetToken();
  const [localCode, setLocalCode] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_LOCAL_API_URL;

  useEffect(() => {
    const getLocalList = async () => {
      if (!addrName) {
        setLocalCode(null);
        return;
      }

      const fallbackCode = DEFAULT_SIDO_CODES[addrName];

      if (!accessToken || !baseUrl) {
        setLocalCode(fallbackCode ?? null);
        return;
      }

      try {
        const SIDOURL = `${baseUrl}?accessToken=${accessToken}`;
        const response = await fetch(SIDOURL);

        if (!response.ok) {
          throw new Error('시/도 목록을 불러오는데 실패했습니다.');
        }
        const jsonData: AddressData = await response.json();
        const data = jsonData.result;
        const code = data?.find((item) => item.addr_name.includes(addrName))?.cd;
        setLocalCode(code?.toString() ?? fallbackCode ?? null);
      } catch (error) {
        console.error('시도 코드 가져오기 에러남: ' + error);
        setLocalCode(fallbackCode ?? null);
      }
    };
    getLocalList();
  }, [accessToken, addrName, baseUrl]);
  return localCode;
};

/* -------------------------------------------------------------------------- */
//군구 리스트

export const GetGunguList = (codeOrName: string) => {
  const [localList, setLocalList] = useState<string[]>([]);
  const accessToken = useGetToken();
  const baseUrl = import.meta.env.VITE_LOCAL_API_URL;

  useEffect(() => {
    const getLocalList = async () => {
      if (!codeOrName) {
        setLocalList([]);
        return;
      }

      const fallbackList = DEFAULT_GUNGU_BY_SIDO[codeOrName];
      const isCode = /^[0-9]+$/.test(codeOrName);

      if (!isCode) {
        setLocalList(fallbackList ?? []);
        return;
      }

      if (!accessToken || !baseUrl) {
        setLocalList(fallbackList ?? []);
        return;
      }

      const GUNGUURL = `${baseUrl}?accessToken=${accessToken}&cd=${codeOrName}`;

      try {
        const response = await fetch(GUNGUURL);

        if (!response.ok) {
          throw new Error('군/구 목록을 불러오는데 실패했습니다.');
        }
        const jsonData: AddressData = await response.json();
        const items = jsonData.result; // 최종데이터

        const nameList = items.map((item) => item.addr_name); // 가져온 데이터에서 이름 뿌리기
        if (nameList.length > 0) {
          setLocalList(nameList);
        } else if (fallbackList) {
          setLocalList(fallbackList);
        }
      } catch (error) {
        console.error('군구 리스트 뿌리기 에러남: ' + error);
        if (fallbackList) {
          setLocalList(fallbackList);
        }
      }
    };
    getLocalList();
  }, [accessToken, codeOrName, baseUrl]);
  return localList;
};

export const defaultRegionData = {
  SIDOS: DEFAULT_SIDO_LIST,
  GUNGUS: DEFAULT_GUNGU_BY_SIDO,
  SIDO_CODES: DEFAULT_SIDO_CODES
};
