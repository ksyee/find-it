import {
  useInfiniteQuery,
  UseInfiniteQueryOptions
} from '@tanstack/react-query';
import { AllData } from '@/types/types';
import { getFoundItems } from '@/entities/found/api/getFoundItems';

export const FOUND_ITEMS_QUERY_KEY = 'foundItems';

type FoundItemsQueryOptions = Omit<
  UseInfiniteQueryOptions<AllData[], Error>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'select'
>;

interface UseFoundItemsInfiniteOptions {
  pageSize?: number;
  query?: FoundItemsQueryOptions;
}

export const useFoundItemsInfinite = (
  options?: UseFoundItemsInfiniteOptions
) => {
  const pageSize = options?.pageSize ?? 10;

  return useInfiniteQuery<AllData[], Error>({
    queryKey: [FOUND_ITEMS_QUERY_KEY, pageSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : 0;
      return getFoundItems(page, pageSize);
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
