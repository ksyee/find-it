import { useEffect, useState } from 'react';
import useGetToken from '@/lib/utils/useGetToken';
import { logger } from '@/lib/utils/logger';
import { DEFAULT_GUNGU_BY_SIDO } from '../constants/regionDefaults';

interface AddressData {
  result: { addr_name: string }[];
}

const useGunguList = (codeOrName: string) => {
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
        const items = jsonData.result;
        const nameList = items.map((item) => item.addr_name);
        if (nameList.length > 0) {
          setLocalList(nameList);
        } else if (fallbackList) {
          setLocalList(fallbackList);
        }
      } catch (error) {
        logger.error('군구 리스트 불러오기 실패', error);
        if (fallbackList) {
          setLocalList(fallbackList);
        }
      }
    };
    void getLocalList();
  }, [accessToken, codeOrName, baseUrl]);
  return localList;
};

export default useGunguList;
