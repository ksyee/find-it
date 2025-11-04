import { useCallback, useEffect, useRef } from 'react';
import Header from '@/widgets/header/ui/Header';
import loading from '@/assets/loading.svg';
import ItemBox from '@/entities/item/ui/ItemBox';
import Skeleton from '@/entities/item/ui/Skeleton';
import QueryState from '@/shared/ui/QueryState';
import EmptyState from '@/shared/ui/EmptyState';
import { useFoundItemsInfinite } from '@/entities/found/model/useFoundItemsInfinite';
import useScrollRestoration from '@/shared/hooks/useScrollRestoration';

const GetList = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useFoundItemsInfinite({
    query: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30
    }
  });

  const items = data?.pages?.flatMap((page) => page) ?? [];
  useScrollRestoration(scrollContainerRef, 'getlist');

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
        link="/searchfind"
        children="습득물 찾기"
      />
      <div className="w-full max-w-[375px] md:max-w-[768px] lg:max-w-[1280px]">
        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-146px)] overflow-auto lg:h-[calc(100vh-138px)]"
        >
          <div className="flex flex-col items-center lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:p-5">
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
          link="/searchfind"
          children="습득물 찾기"
        />
        <div className="w-full max-w-[375px] md:max-w-[768px] lg:max-w-[1280px]">
          <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-146px)] overflow-auto lg:h-[calc(100vh-138px)]"
          >
            {items.length > 0 ? (
              <ul className="flex flex-col items-center lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:p-5">
                {items.map((item, index) => (
                  <li key={`${item.atcId}-${index}`} className="flex justify-center lg:justify-stretch">
                    <ItemBox item={item} itemType="get" />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="등록된 습득물이 없습니다."
                description="새로운 습득물 정보를 기다리고 있어요."
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

export default GetList;
