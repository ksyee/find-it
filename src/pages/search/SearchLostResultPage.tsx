import { useCallback, useEffect, useRef } from 'react';
import Header from '@/widgets/header/ui/Header';
import useSearchStore from '@/features/search/model/searchStore';
import loading from '@/assets/loading.svg';
import ItemBox from '@/entities/item/ui/ItemBox';
import Skeleton from '@/entities/item/ui/Skeleton';
import QueryState from '@/shared/ui/QueryState';
import EmptyState from '@/shared/ui/EmptyState';
import { useSearchLostInfinite } from '@/features/search/api/useSearchLostInfinite';
import { useNavigate } from 'react-router-dom';

const SearchLostResult = () => {
  const {
    selectStartDate,
    selectEndDate,
    selectedMainCategoryValue,
    selectedSubCategoryValue,
    selectedAreaValue
  } = useSearchStore();

  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const queryEnabled = selectStartDate !== '날짜를 선택하세요.';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useSearchLostInfinite(
    {
      startDate: selectStartDate,
      endDate: selectEndDate,
      mainCategory: selectedMainCategoryValue,
      subCategory: selectedSubCategoryValue,
      area: selectedAreaValue
    },
    {
      enabled: queryEnabled,
      query: {
        retry: false,
        staleTime: 0,
        gcTime: 1000 * 60 * 5
      }
    }
  );

  const items = data?.pages?.flatMap((page) => page) ?? [];

  const handleScroll = useCallback(
    (event: Event) => {
      const target = event.target as HTMLDivElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll as EventListener);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll as EventListener);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!queryEnabled) {
      navigate('/searchlost');
    }
  }, [navigate, queryEnabled]);

  const loadingFallback = (
    <div className="flex h-screen w-full flex-col items-center bg-gray-200">
      <Header isShowPrev empty>
        검색결과
      </Header>
      <div className="w-[375px]">
        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-[66px]-80px)] overflow-auto"
        >
          <div className="flex flex-col items-center">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      loadingFallback={loadingFallback}
    >
      <div className="flex h-screen w-full flex-col items-center bg-gray-200">
        <Header isShowPrev empty>
          검색결과
        </Header>
        <div className="w-[375px]">
          <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-[66px]-80px)] overflow-auto"
          >
            {items.length > 0 ? (
              <ul className="flex flex-col items-center">
                {items.map((item, index) => (
                  <li key={`${item.atcId}-${index}`} className="flex justify-center">
                    <ItemBox item={item} itemType="lost" />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="검색 결과가 없습니다."
                description="조건을 조정해 다시 시도해 주세요."
              />
            )}
            {isFetchingNextPage && (
              <img src={loading} alt="로딩 중" className="mx-auto" />
            )}
          </div>
        </div>
      </div>
    </QueryState>
  );
};

export default SearchLostResult;
