import { useEffect, useState } from 'react';
import useGetToken from '@/lib/utils/useGetToken';
import { logger } from '@/lib/utils/logger';
import { DEFAULT_SIDO_CODES } from '../constants/regionDefaults';

interface AddressData {
  result: { addr_name: string; cd: number }[];
}

const useSidoCode = (addrName: string) => {
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
        logger.error('시도 코드 가져오기 실패', error);
        setLocalCode(fallbackCode ?? null);
      }
    };
    void getLocalList();
  }, [accessToken, addrName, baseUrl]);
  return localCode;
};

export default useSidoCode;
