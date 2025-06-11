import { useEffect, useState } from 'react';
import useGetToken from '@/lib/utils/useGetToken';

/**
 * 주소 데이터 응답 타입
 */
interface AddressData {
  result: { addr_name: string; cd: number }[];
}

/**
 * 시/도 목록을 가져오는 훅
 * @returns 시/도 이름 목록 배열
 */
export const useSidoList = () => {
  const accessToken = useGetToken();
  const [localList, setLocalList] = useState<string[]>([]);
  const SIDOURL = `${import.meta.env.VITE_LOCAL_API_URL}?accessToken=${accessToken}`; // 시도코드

  useEffect(() => {
    const getLocalList = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(SIDOURL);

        if (!response.ok) {
          throw new Error('시/도 목록을 불러오는데 실패했습니다.');
        }
        const jsonData: AddressData = await response.json();
        const items = jsonData.result; // 최종 데이터

        const nameList = items.map((item) => item.addr_name); // 가져온 데이터에서 이름 뿌리기
        setLocalList(nameList);
      } catch (error) {
        console.error('시도 리스트 가져오기 에러:', error);
      }
    };
    getLocalList();
  }, [accessToken, SIDOURL]);
  
  return localList;
};

/**
 * 주소 이름에 해당하는 코드를 가져오는 훅
 * @param addrName 주소 이름
 * @returns 주소 코드 (string | null)
 */
export const useLocationCode = (addrName: string) => {
  const accessToken = useGetToken();
  const [localCode, setLocalCode] = useState<string | null>(null);

  useEffect(() => {
    const getLocalList = async () => {
      if (!accessToken) return;

      try {
        const SIDOURL = `${import.meta.env.VITE_LOCAL_API_URL}?accessToken=${accessToken}`;
        const response = await fetch(SIDOURL);

        if (!response.ok) {
          throw new Error('시/도 목록을 불러오는데 실패했습니다.');
        }
        const jsonData: AddressData = await response.json();
        const data = jsonData.result; // 최종 데이터
        const code = data?.find((item) =>
          item.addr_name.includes(addrName)
        )?.cd;
        setLocalCode(code?.toString() || null);
      } catch (error) {
        console.error('시도 코드 가져오기 에러:', error);
      }
    };
    getLocalList();
  }, [accessToken, addrName]);
  
  return localCode;
};

/**
 * 군/구 목록을 가져오는 훅
 * @param codeParam 시/도 코드
 * @returns 군/구 이름 목록 배열
 */
export const useGunguList = (codeParam: string) => {
  const [localList, setLocalList] = useState<string[]>([]);
  const accessToken = useGetToken();
  const GUNGUURL = `${import.meta.env.VITE_LOCAL_API_URL}?accessToken=${accessToken}&cd=${codeParam}`; // 군구코드

  useEffect(() => {
    const getLocalList = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(GUNGUURL);

        if (!response.ok) {
          throw new Error('군/구 목록을 불러오는데 실패했습니다.');
        }
        const jsonData: AddressData = await response.json();
        const items = jsonData.result; // 최종데이터

        const nameList = items.map((item) => item.addr_name); // 가져온 데이터에서 이름 뿌리기
        setLocalList(nameList);
      } catch (error) {
        console.error('군구 리스트 가져오기 에러:', error);
      }
    };
    getLocalList();
  }, [accessToken, GUNGUURL]);
  
  return localList;
};
