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
import { getLostItems } from '@/lib/utils/getLostSupabaseData';
import { SyncScheduler } from '@/lib/utils/scheduledSync';
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

const LostList = () => {
  // const [items, setItems] = useState([]);
  // const [page, setPage] = useState(1);
  // const [fetching, setFetching] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  const scrollContainerRef = useRef(null);
  const [useBackupData, setUseBackupData] = useState(false);
  const [hasSwitchedToRealData, setHasSwitchedToRealData] = useState(false);
  const [dataSource, setDataSource] = useState<'supabase' | 'api' | 'sample'>(
    'supabase'
  );

  // 동기화 스케줄러 시작
  useEffect(() => {
    console.log('동기화 스케줄러 시작');
    const scheduler = SyncScheduler.getInstance();
    scheduler.start();

    return () => {
      scheduler.stop();
    };
  }, []);

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
      // 데이터 소스에 따라 다른 함수 호출
      switch (dataSource) {
        case 'supabase':
          try {
            // Supabase에서 데이터 가져오기 (실패하면 자동으로 API로 폴백)
            const supabaseData = await getLostItems({
              pageNo: pageParam,
              numOfRows: 10,
            });
            if (supabaseData && supabaseData.length > 0) {
              return supabaseData;
            }
            // Supabase 데이터가 없으면 API로 변경
            console.log('Supabase 분실물 데이터 없음, API로 변경');
            setDataSource('api');
            return await lostAllData({ pageNo: pageParam, numOfRows: 10 });
          } catch (error) {
            console.error('Supabase 분실물 데이터 가져오기 실패:', error);
            setDataSource('api');
            return await lostAllData({ pageNo: pageParam, numOfRows: 10 });
          }

        case 'api':
          try {
            const apiData = await lostAllData({
              pageNo: pageParam,
              numOfRows: 10,
            });
            if (apiData && Array.isArray(apiData) && apiData.length > 0) {
              return apiData;
            }
            // API 데이터도 없으면 샘플 데이터로 변경
            console.log('API 분실물 데이터 없음, 샘플 데이터로 변경');
            setDataSource('sample');
            setUseBackupData(true);
            return sampleData;
          } catch (error) {
            console.error('API 분실물 데이터 가져오기 실패:', error);
            setDataSource('sample');
            setUseBackupData(true);
            return sampleData;
          }

        case 'sample':
          return sampleData;

        default:
          return sampleData;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // 샘플 데이터인 경우 더 이상 페이지 없음
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

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      if (
        scrollTop + clientHeight >= scrollHeight * 0.9 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        console.log('스크롤 감지, 다음 페이지 불러오기 시도');
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
          children="분실물 확인"
          isShowSearch={true}
          link="/searchlost"
        />
        <div className="w-375px">
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

  // LostAllData를 ItemData로 변환
  const mapLostDataToItemData = (lostData: any): ItemData => {
    return {
      atcId: lostData.atcId,
      lstPrdtNm: lostData.lstPrdtNm,
      lstYmd: lostData.lstYmd,
      lstPlace: lostData.lstPlace,
      lstFilePathImg: lostData.lstFilePathImg,
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
      <div className="w-375px">
        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-66px-80px)] overflow-auto"
        >
          <ul className="flex flex-col items-center">
            {data?.pages?.map((page: any[]) =>
              page?.map((item, index) => (
                <li key={index}>
                  <ItemBox item={mapLostDataToItemData(item)} itemType="lost" />
                </li>
              ))
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

export default LostList;
