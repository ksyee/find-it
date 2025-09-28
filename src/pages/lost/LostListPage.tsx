import { useCallback, useEffect, useRef } from 'react';
import Header from '@/widgets/header/ui/Header';
import loading from '@/assets/loading.svg';
import ItemBox from '@/entities/item/ui/ItemBox';
import Skeleton from '@/entities/item/ui/Skeleton';
import QueryState from '@/shared/ui/QueryState';
import EmptyState from '@/shared/ui/EmptyState';
import { useLostItemsInfinite } from '@/entities/lost/model/useLostItemsInfinite';

const LostList = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useLostItemsInfinite({
    query: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30
    }
  });

  const items = data?.pages?.flatMap((page) => page) ?? [];

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = el;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const loadingFallback = (
    <div className="flex h-screen w-full flex-col items-center bg-gray-200">
      <Header
        isShowSymbol
        isShowSearch
        link="/searchlost"
        children="분실물 확인"
      />
      <div className="w-[375px]">
        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-146px)] overflow-auto"
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
        <Header
          isShowSymbol
          isShowSearch
          link="/searchlost"
          children="분실물 확인"
        />
        <div className="w-[375px]">
          <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-146px)] overflow-auto"
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
                title="등록된 분실물이 없습니다."
                description="새로운 분실물 신고를 기다리고 있어요."
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

export default LostList;
