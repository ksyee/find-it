import {
  useInfiniteQuery,
  UseInfiniteQueryOptions
} from '@tanstack/react-query';
import { AllData } from '@/types/types';
import { getSearchLostData } from '@/lib/utils/getAPIData';
import getFormattedDate from '@/lib/utils/getFormattedDate';

export interface SearchLostFilters {
  startDate: string;
  endDate: string;
  mainCategory: string;
  subCategory: string;
  area: string;
}

const normalizeItems = (raw: unknown): AllData[] => {
  if (!raw) {
    return [];
  }

  const items = Array.isArray(raw) ? raw : [raw];

  return items.reduce<AllData[]>((acc, item) => {
    if (!item || typeof item !== 'object') {
      return acc;
    }

    const typedItem = item as Record<string, string | undefined>;

    acc.push({
      atcId: typedItem.atcId ?? '',
      depPlace: '',
      fdFilePathImg:
        typedItem.fdFilePathImg && typedItem.fdFilePathImg !== ''
          ? typedItem.fdFilePathImg
          : 'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif',
      fdPrdtNm: typedItem.fdPrdtNm ?? '',
      fdSbjt: typedItem.fdSbjt ?? '',
      fdSn: typedItem.fdSn ?? '',
      fdYmd: typedItem.fdYmd ?? '',
      prdtClNm: typedItem.prdtClNm ?? '',
      rnum: typedItem.rnum ?? '',
      lstYmd: typedItem.lstYmd ?? '',
      lstPlace: typedItem.lstPlace ?? '',
      lstPrdtNm: typedItem.lstPrdtNm ?? ''
    });

    return acc;
  }, []);
};

export const buildSearchLostQueryKey = (filters: SearchLostFilters) => [
  'searchLostResult',
  filters
] as const;

type SearchLostQueryOptions = Omit<
  UseInfiniteQueryOptions<AllData[], Error>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'select'
>;

interface UseSearchLostInfiniteOptions {
  enabled?: boolean;
  pageSize?: number;
  query?: SearchLostQueryOptions;
}

export const useSearchLostInfinite = (
  filters: SearchLostFilters,
  options?: UseSearchLostInfiniteOptions
) => {
  const pageSize = options?.pageSize ?? 10;

  return useInfiniteQuery<AllData[], Error>({
    queryKey: [...buildSearchLostQueryKey(filters), pageSize],
    initialPageParam: 1,
    enabled: options?.enabled,
    queryFn: async ({ pageParam }) => {
      const formattedStart =
        filters.startDate !== '날짜를 선택하세요.'
          ? getFormattedDate(filters.startDate)
          : '';
      const formattedEnd =
        filters.endDate !== '날짜를 선택하세요.'
          ? getFormattedDate(filters.endDate)
          : '';

      const response = await getSearchLostData({
        PRDT_CL_CD_01: filters.mainCategory,
        PRDT_CL_CD_02: filters.subCategory,
        N_FD_LCT_CD: filters.area,
        START_YMD: formattedStart,
        END_YMD: formattedEnd,
        pageNo: pageParam,
        numOfRows: pageSize
      });

      return normalizeItems(response);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!Array.isArray(lastPage) || lastPage.length < pageSize) {
        return undefined;
      }
      return allPages.length + 1;
    },
    ...options?.query
  });
};
