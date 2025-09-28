import {
  useInfiniteQuery,
  UseInfiniteQueryOptions
} from '@tanstack/react-query';
import { AllData } from '@/types/types';
import { getLostItems } from '@/entities/lost/api/getLostItems';

export const LOST_ITEMS_QUERY_KEY = 'lostItems';

type LostItemsQueryOptions = Omit<
  UseInfiniteQueryOptions<AllData[], Error>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'select'
>;

interface UseLostItemsInfiniteOptions {
  pageSize?: number;
  query?: LostItemsQueryOptions;
}

export const useLostItemsInfinite = (
  options?: UseLostItemsInfiniteOptions
) => {
  const pageSize = options?.pageSize ?? 10;

  return useInfiniteQuery<AllData[], Error>({
    queryKey: [LOST_ITEMS_QUERY_KEY, pageSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : 0;
      return getLostItems(page, pageSize);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!Array.isArray(lastPage) || lastPage.length < pageSize) {
        return undefined;
      }
      return allPages.length;
    },
    ...options?.query
  });
};
