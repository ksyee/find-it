import Header from '../Header/Header';
import useSearchStore from '@/store/search/searchStore';
import { useEffect, useRef, UIEvent, useCallback } from 'react';
import loading from '@/assets/loading.svg';
import { AllData } from '@/types/types';
import ItemBox from '@/components/ItemBox/ItemBox';
import { getSearchFindData } from '@/lib/utils/getAPIData';
import getFormattedDate from '@/lib/utils/getFormattedDate';
import Navigation from '../Navigation/Navigation';
import { useNavigate } from 'react-router-dom';
import Skeleton from './../ItemBox/Skeleton';
import { useInfiniteQuery } from '@tanstack/react-query';

/**
 * 습득물 검색 결과 컴포넌트
 */
const SearchFindResult = () => {
  const {
    selectStartDate,
    selectEndDate,
    selectedMainCategoryValue,
    selectedSubCategoryValue,
    selectedAreaValue,
  } = useSearchStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // React Query를 사용한 무한 스크롤 데이터 로딩
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['searchFindResult'],
      queryFn: async ({ pageParam }) =>
        await getSearchFindData({
          PRDT_CL_CD_01: selectedMainCategoryValue,
          PRDT_CL_CD_02: selectedSubCategoryValue,
          N_FD_LCT_CD: selectedAreaValue,
          START_YMD:
            selectStartDate !== '날짜를 선택하세요.'
              ? getFormattedDate(selectStartDate)
              : '',
          END_YMD:
            selectEndDate !== '날짜를 선택하세요.'
              ? getFormattedDate(selectEndDate)
              : '',
          pageNo: pageParam,
          numOfRows: 10,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.body?.items?.item && lastPage.body.items.item.length > 0) {
          return lastPage.body.pageNo + 1;
        }
        return undefined;
      },
    });

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      if (
        scrollTop + clientHeight >= scrollHeight - 20 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll as any);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll as any);
      };
    }
  }, [handleScroll]);

  // 시작 날짜가 선택되지 않은 경우 검색 페이지로 리다이렉트
  useEffect(() => {
    if (selectStartDate === '날짜를 선택하세요.') {
      navigate('/searchfind');
    }
  }, [navigate, selectStartDate]);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center bg-gray-200">
        <Header isShowPrev={true} empty={true}>
          검색결과
        </Header>
        <div className="w-375px">
          <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-66px-80px)] overflow-auto"
          >
            <div className="flex flex-col items-center">
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} />
                ))}
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  // 결과 UI
  return (
    <div className="flex h-screen w-full flex-col items-center bg-gray-200">
      <Header isShowPrev={true} empty={true}>
        검색결과
      </Header>
      <div className="w-375px">
        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-66px-80px)] overflow-auto"
        >
          <ul className="flex flex-col items-center">
            {data?.pages.map((page, pageIndex: number) =>
              page.body?.items?.item && page.body.items.item.length > 0
                ? page.body.items.item.map(
                    (item: AllData, itemIndex: number) => (
                      <li key={`${pageIndex}-${itemIndex}`}>
                        <ItemBox item={item} itemType="get" />
                      </li>
                    )
                  )
                : pageIndex === data.pages.length - 1 && (
                    <li key={pageIndex} className="mb-16px text-center">
                      검색 결과가 없습니다.
                    </li>
                  )
            )}
          </ul>
          {isFetchingNextPage && (
            <img src={loading} alt="로딩 중" className="mx-auto" />
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default SearchFindResult;
