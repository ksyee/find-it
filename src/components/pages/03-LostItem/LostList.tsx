import Header from '../../Header/Header';
import loading from '@/assets/loading.svg';
import ItemBox, { ItemData } from '../../ItemBox/ItemBox';
import Navigation from '../../Navigation/Navigation';
// import { JsonArray } from '@/types/types';
// import { lostAllData } from '@/lib/utils/lostAPIData';
import { useEffect, useRef, UIEvent, useCallback, useState } from 'react';
import Skeleton from '@/components/ItemBox/Skeleton';
import { useInfiniteQuery } from '@tanstack/react-query';
import { lostAllData } from '@/lib/utils/lostAPIData';
import { AllData, LostAllData } from '@/types/types';

// 샘플 데이터
const sampleData = [
  {
    atcId: 'L2023040100000001',
    lstPrdtNm: '지갑',
    lstFilePathImg:
      'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif',
    lstYmd: '2023-04-01',
    lstPlace: '강남역',
    lstSbjt: '검정색 가죽 지갑을 분실했습니다.',
    lstSn: '1',
    prdtClNm: '가방/지갑/벨트 > 지갑',
    rnum: '1',
  },
  {
    atcId: 'L2023040100000002',
    lstPrdtNm: '휴대폰',
    lstFilePathImg:
      'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif',
    lstYmd: '2023-04-01',
    lstPlace: '서울역',
    lstSbjt: '아이폰 14 프로 분실했습니다.',
    lstSn: '1',
    prdtClNm: '전자기기 > 휴대폰',
    rnum: '2',
  },
  {
    atcId: 'L2023040100000003',
    lstPrdtNm: '노트북',
    lstFilePathImg:
      'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif',
    lstYmd: '2023-04-01',
    lstPlace: '스타벅스 강남점',
    lstSbjt: '맥북 프로 스페이스 그레이 분실했습니다.',
    lstSn: '1',
    prdtClNm: '전자기기 > 노트북',
    rnum: '3',
  },
];

// 타입 정의
interface LostItemData {
  atcId: string;
  lstPrdtNm: string;
  lstFilePathImg: string;
  lstYmd: string;
  lstPlace: string;
  lstSbjt: string;
  lstSn: string;
  prdtClNm: string;
  rnum: string;
}

const LostList = () => {
  // const [items, setItems] = useState([]);
  // const [page, setPage] = useState(1);
  // const [fetching, setFetching] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [useBackupData, setUseBackupData] = useState(false);
  const [hasSwitchedToRealData, setHasSwitchedToRealData] = useState(false);
  const [dataSource, setDataSource] = useState<'api' | 'sample'>('api');

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
    queryKey: ['lostListItems'],
    queryFn: async ({ pageParam = 1 }) => {
      let result;
      try {
        switch (dataSource) {
          case 'api': {
            const apiData = await lostAllData({
              pageNo: pageParam,
              numOfRows: 10,
            });
            if (apiData && Array.isArray(apiData) && apiData.length > 0) {
              result = apiData;
              break;
            }
            throw new Error('API 데이터가 비어있습니다.');
          }
          case 'sample':
            result = sampleData;
            break;
          default:
            result = sampleData;
        }
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
        setDataSource('sample');
        setUseBackupData(true);
        result = sampleData;
      }
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (dataSource === 'sample') return undefined;
      if (Array.isArray(lastPage) && lastPage.length > 0) {
        return allPages.length + 1;
      }
      return undefined;
    },
    retry: 2,
    retryDelay: 1000,
  });

  // 데이터 소스 로깅
  useEffect(() => {
    console.log('현재 분실물 데이터 소스:', dataSource);
  }, [dataSource]);

  // 오류 시 백업 데이터로 전환
  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((isError || (!data && !isLoading)) && !useBackupData) {
        console.log('시간 초과 또는 API 오류, 분실물 백업 데이터 사용');
        setDataSource('sample');
        setUseBackupData(true);
      }
    }, 10000); // 10초 후 확인

    return () => clearTimeout(timeout);
  }, [isError, isLoading, data, useBackupData]);

  // 백업 데이터 사용 중일 때 30초마다 실제 데이터 로드 재시도
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (useBackupData && !hasSwitchedToRealData) {
      intervalId = setInterval(() => {
        console.log('백그라운드에서 실제 데이터 로드 재시도...');
        // 데이터 소스를 API로 변경하고 다시 시도
        setDataSource('api');
        refetch();
      }, 30000); // 30초마다 재시도
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [useBackupData, hasSwitchedToRealData, refetch]);

  const handleRetryRealData = () => {
    console.log('사용자가 실제 데이터 로드 재시도를 요청했습니다.');
    setDataSource('api');
    setUseBackupData(false);
    refetch();
  };

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
    if (!scrollContainer) return;

    const handleScrollEvent = (event: Event) => {
      handleScroll(event as unknown as UIEvent<HTMLDivElement>);
    };

    scrollContainer.addEventListener('scroll', handleScrollEvent);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScrollEvent);
    };
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center bg-gray-200">
        <Header
          isShowSymbol={true}
          children="분실물 확인"
          isShowSearch={true}
          link="/searchlost"
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

  // 백업 데이터 사용 시 렌더링
  if (useBackupData) {
    return (
      <div className="flex h-screen w-full flex-col items-center bg-gray-200">
        <Header
          isShowSymbol={true}
          children="분실물 확인"
          isShowSearch={true}
          link="/searchlost"
        />
        <div className="w-full max-w-md px-4 mx-auto">
          <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-66px-80px)] overflow-auto"
          >
            <ul className="flex flex-col items-center">
              {sampleData.map((item, index) => (
                <li key={index} className="flex justify-center">
                  <ItemBox item={mapLostDataToItemData(item)} itemType="lost" />
                </li>
              ))}
            </ul>
            <div className="text-center text-gray-500 my-4">
              API 연결 문제로 인해 샘플 데이터를 보여주고 있습니다.
              <button
                onClick={handleRetryRealData}
                className="block mx-auto mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                실제 데이터 다시 불러오기
              </button>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  // LostAllData를 ItemData로 변환
  const mapLostDataToItemData = (lostData: LostAllData): ItemData => {
    return {
      atcId: lostData.lstSn || '',
      lstPrdtNm: lostData.lstPrdtNm || '',
      lstYmd: lostData.lstYmd || '',
      lstPlace: lostData.lstPlace || '',
      lstFilePathImg: lostData.lstFilePathImg || '',
    };
  };

  return (
    <div className="flex h-screen w-full flex-col items-center bg-gray-200">
      <Header
        isShowSymbol={true}
        children="분실물 확인"
        isShowSearch={true}
        link="/searchlost"
      />
      <div className="w-full max-w-md px-4 mx-auto">
        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-66px-80px)] overflow-auto"
        >
          {isSuccess && data.pages[0].length > 0 ? (
            <>
              <ul className="flex flex-col items-center w-full">
                {data.pages.map((page: LostAllData[], pageIndex) =>
                  page.map((item, index) => (
                    <li
                      key={`${pageIndex}-${index}`}
                      className="w-full flex justify-center px-4"
                    >
                      <div className="w-full">
                        <ItemBox
                          item={mapLostDataToItemData(item)}
                          itemType="lost"
                        />
                      </div>
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

export default LostList;
