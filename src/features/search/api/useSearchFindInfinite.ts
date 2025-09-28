import {
  useInfiniteQuery,
  UseInfiniteQueryOptions
} from '@tanstack/react-query';
import { AllData } from '@/types/types';
import { getSearchFindData } from '@/lib/utils/getAPIData';
import getFormattedDate from '@/lib/utils/getFormattedDate';

export interface SearchFindFilters {
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
      depPlace: typedItem.depPlace ?? '',
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

export const buildSearchFindQueryKey = (filters: SearchFindFilters) => [
  'searchFindResult',
  filters
] as const;

type SearchFindQueryOptions = Omit<
  UseInfiniteQueryOptions<AllData[], Error>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'select'
>;

interface UseSearchFindInfiniteOptions {
  enabled?: boolean;
  pageSize?: number;
  query?: SearchFindQueryOptions;
}

export const useSearchFindInfinite = (
  filters: SearchFindFilters,
  options?: UseSearchFindInfiniteOptions
) => {
  const pageSize = options?.pageSize ?? 10;

  return useInfiniteQuery<AllData[], Error>({
    queryKey: [...buildSearchFindQueryKey(filters), pageSize],
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

      const response = await getSearchFindData({
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
