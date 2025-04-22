import { useInfiniteQuery } from '@tanstack/react-query';
import Header from '../../Header/Header';
import loading from '@/assets/loading.svg';
import ItemBox, { ItemData } from '../../ItemBox/ItemBox';
import Navigation from '../../Navigation/Navigation';
import { getAllData } from '@/lib/utils/getAPIData';
import { useEffect, useRef, UIEvent, useCallback } from 'react';
import Skeleton from '@/components/ItemBox/Skeleton';
import { AllData } from '@/types/types';

const GetList = () => {
  const scrollContainerRef = useRef(null);

  // AllData를 ItemData로 변환하는 함수
  const mapAllDataToItemData = (allData: any): ItemData => {
    return {
      atcId: allData.atcId,
      fdPrdtNm: allData.fdPrdtNm,
      fdYmd: allData.fdYmd,
      depPlace: allData.depPlace,
      fdFilePathImg: allData.fdFilePathImg,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['getListItems'],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        console.log(`API에서 데이터 가져오기 시도 (페이지: ${pageParam})`);
        const apiData = await getAllData({
          pageNo: pageParam,
          numOfRows: 10,
        });

        if (apiData && apiData.length > 0) {
          console.log(`API 데이터 성공적으로 로드됨: ${apiData.length}개 항목`);
          return apiData;
        }
        return [];
      } catch (error) {
        console.error('API 데이터 가져오기 실패:', error);
        return [];
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (Array.isArray(lastPage) && lastPage.length > 0) {
        return allPages.length + 1;
      }
      return undefined;
    },
    retry: 2,
    retryDelay: 1000,
  });

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      if (
        scrollTop + clientHeight >= scrollHeight * 0.9 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

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
        <div className="w-full max-w-md px-4 mx-auto">
          <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-66px-80px)] overflow-auto"
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
        <Navigation />
      </div>
    );
  }

  if (isError || !data || !data.pages || data.pages.length === 0) {
    return (
      <div className="flex h-screen w-full flex-col items-center bg-gray-200">
        <Header
          isShowSymbol={true}
          children="습득물 찾기"
          isShowSearch={true}
          link="/searchfind"
        />
        <div className="w-full max-w-md px-4 mx-auto">
          <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-66px-80px)] overflow-auto"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 text-center mb-4">
                데이터를 불러올 수 없습니다.
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
        <Navigation />
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
      <div className="w-full max-w-md px-4 mx-auto">
        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-66px-80px)] overflow-auto"
        >
          {isSuccess && data.pages[0].length > 0 ? (
            <>
              <ul className="flex flex-col items-center w-full">
                {data.pages.map((page: AllData[], pageIndex) =>
                  page.map((item, index) => (
                    <li key={`${pageIndex}-${index}`} className="w-full">
                      <ItemBox
                        item={mapAllDataToItemData(item)}
                        itemType="get"
                      />
                    </li>
                  ))
                )}
              </ul>
              {isFetchingNextPage && (
                <img src={loading} alt="로딩 중" className="mx-auto" />
              )}
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">표시할 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default GetList;
