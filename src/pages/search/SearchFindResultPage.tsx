import { useCallback, useEffect, useRef } from 'react';
import useSearchStore from '@/features/search/model/searchStore';
import ItemBox from '@/entities/item/ui/ItemBox';
import Skeleton from '@/entities/item/ui/Skeleton';
import QueryState from '@/shared/ui/QueryState';
import EmptyState from '@/shared/ui/EmptyState';
import DotPulse from '@/shared/ui/DotPulse';
import { useSearchFindInfinite } from '@/features/search/api/useSearchFindInfinite';
import { useNavigate } from 'react-router-dom';
import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';

const SearchFindResult = () => {
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
  } = useSearchFindInfinite(
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

  // 데스크탑에서 스크롤이 부족할 경우 자동으로 다음 페이지 로드
  useEffect(() => {
    const checkAndLoadMore = () => {
      const el = scrollContainerRef.current;
      if (!el || !hasNextPage || isFetchingNextPage) return;

      const { scrollHeight, clientHeight } = el;
      // 스크롤 가능한 콘텐츠가 뷰포트보다 작거나 거의 같으면 다음 페이지 로드
      if (scrollHeight <= clientHeight + 100) {
        void fetchNextPage();
      }
    };

    // 아이템이 로드된 후 체크
    if (items.length > 0) {
      // DOM 업데이트 후 체크하기 위해 setTimeout 사용
      setTimeout(checkAndLoadMore, 100);
    }
  }, [items.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
      navigate('/searchfind');
    }
  }, [navigate, queryEnabled]);

  useHeaderConfig(
    () => ({
      isShowPrev: true,
      empty: true,
      children: '검색결과'
    }),
    []
  );

  const loadingFallback = (
    <div className="flex h-nav-safe w-full flex-col items-center bg-white">
      <div className="mx-auto w-full max-w-7xl">
        <div
          ref={scrollContainerRef}
          className="overflow-auto"
          style={{
            height:
              'calc(100dvh - var(--app-nav-top, 0px) - var(--app-nav-bottom))'
          }}
        >
          <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-4 md:px-5 lg:px-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="w-full">
                <Skeleton />
              </div>
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
      <div className="flex h-nav-safe w-full flex-col items-center bg-white">
        <div className="mx-auto w-full max-w-7xl">
          <div
            ref={scrollContainerRef}
            className="overflow-auto"
            style={{
              height:
                'calc(100dvh - var(--app-nav-top, 0px) - var(--app-nav-bottom))'
            }}
          >
            {items.length > 0 ? (
              <ul className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-4 md:px-5 lg:px-5">
                {items.map((item, index) => (
                  <li key={`${item.atcId}-${index}`} className="w-full">
                    <ItemBox item={item} itemType="get" />
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
              <div className="py-8">
                <DotPulse size="md" />
              </div>
            )}
          </div>
        </div>
      </div>
    </QueryState>
  );
};

export default SearchFindResult;
