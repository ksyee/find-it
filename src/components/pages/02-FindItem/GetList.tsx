import { useInfiniteQuery } from '@tanstack/react-query';
import Header from '../../Header/Header';
import loading from '@/assets/loading.svg';
import ItemBox from '../../ItemBox/ItemBox';

import { getFoundItems } from '@/lib/utils/getFoundItems';
import { useEffect, useRef, useCallback } from 'react';
import Skeleton from '@/components/ItemBox/Skeleton';
import { AllData } from '@/types/types';

const GetList = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['getListItems'],
      queryFn: async ({ pageParam = 0 }) => await getFoundItems(pageParam, 10),
      initialPageParam: 0,
      // lastPage: data returned from the last fetch (array of items)
      // allPages: array with results of each fetch
      getNextPageParam: (lastPage, allPages) => {
        // 마지막 페이지의 아이템 개수가 size(10)보다 작으면 더 이상 불러올 데이터가 없다고 판단
        if (!Array.isArray(lastPage) || lastPage.length < 10) {
          return undefined; // hasNextPage 가 false가 됩니다.
        }
        // 다음 페이지 번호는 현재 가져온 페이지 수와 같습니다. (0부터 시작)
        return allPages.length;
      }
    });

  console.log('data');
  console.log(data);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    // 바닥에 거의 도달했을 때(50px 여유) 다음 페이지 로드
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center bg-gray-200">
        <Header
          isShowSymbol={true}
          children="습득물 찾기"
          isShowSearch={true}
          link="/searchfind"
        />
        <div className="w-[375px]">
          <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-146px)] overflow-auto"
          >
            <div className="flex flex-col items-center">
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center bg-gray-200">
      <Header
        isShowSymbol={true}
        children="습득물 찾기"
        isShowSearch={true}
        link="/searchfind"
      />
      <div className="w-[375px]">
        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-146px)] overflow-auto"
        >
          <ul className="flex flex-col items-center">
            {data?.pages?.map((page: AllData[]) =>
              page.map((item, index) => (
                <li key={index}>
                  <ItemBox item={item} itemType="get" />
                </li>
              ))
            )}
          </ul>
          {isFetchingNextPage && (
            <img src={loading} alt="로딩 중" className="mx-auto" />
          )}
        </div>
      </div>
    </div>
  );
};

export default GetList;
