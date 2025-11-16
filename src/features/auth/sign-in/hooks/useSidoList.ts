import { useEffect, useState } from 'react';
import useGetToken from '@/lib/utils/useGetToken';
import { logger } from '@/lib/utils/logger';
import { DEFAULT_SIDO_LIST } from '../constants/regionDefaults';

interface AddressData {
  result: { addr_name: string }[];
}

const useSidoList = () => {
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
        const items = jsonData.result;
        const nameList = items.map((item) => item.addr_name);
        if (nameList.length > 0) {
          setLocalList(nameList);
        }
      } catch (error) {
        logger.error('시도 리스트 불러오기 실패', error);
      }
    };
    void getLocalList();
  }, [accessToken, baseUrl]);
  return localList;
};

export default useSidoList;
