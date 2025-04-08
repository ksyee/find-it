import { useInfiniteQuery } from '@tanstack/react-query';
import Header from '../../Header/Header';
import loading from '@/assets/loading.svg';
import ItemBox, { ItemData } from '../../ItemBox/ItemBox';
import Navigation from '../../Navigation/Navigation';
import { getAllData } from '@/lib/utils/getAPIData';
import { getFindItems } from '@/lib/utils/getSupabaseData';
import { SyncScheduler } from '@/lib/utils/scheduledSync';
import { useEffect, useRef, UIEvent, useCallback, useState } from 'react';
import Skeleton from '@/components/ItemBox/Skeleton';
import { AllData } from '@/types/types';

// 샘플 데이터
const sampleData = [
  {
    atcId: 'F2023040100000001',
    fdPrdtNm: '에어팟',
    fdFilePathImg:
      'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif',
    fdYmd: '2023-04-01',
    depPlace: '강남경찰서',
    fdSbjt: '흰색 에어팟 프로를 습득하여 보관중입니다.',
    fdSn: '1',
    prdtClNm: '전자기기 > 이어폰',
    rnum: '1',
    lstYmd: '',
    lstPlace: '',
    lstPrdtNm: '',
  },
  {
    atcId: 'F2023040100000002',
    fdPrdtNm: '가방',
    fdFilePathImg:
      'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif',
    fdYmd: '2023-04-01',
    depPlace: '종로경찰서',
    fdSbjt: '검정색 가죽 크로스백을 습득하여 보관중입니다.',
    fdSn: '1',
    prdtClNm: '가방/지갑/벨트 > 크로스백',
    rnum: '2',
    lstYmd: '',
    lstPlace: '',
    lstPrdtNm: '',
  },
  {
    atcId: 'F2023040100000003',
    fdPrdtNm: '선글라스',
    fdFilePathImg:
      'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif',
    fdYmd: '2023-04-01',
    depPlace: '마포경찰서',
    fdSbjt: '레이밴 선글라스를 습득하여 보관중입니다.',
    fdSn: '1',
    prdtClNm: '안경/선글라스 > 선글라스',
    rnum: '3',
    lstYmd: '',
    lstPlace: '',
    lstPrdtNm: '',
  },
];

const GetList = () => {
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
      // 데이터 소스에 따라 다른 함수 호출
      switch (dataSource) {
        case 'supabase':
          try {
            // Supabase에서 데이터 가져오기 (실패하면 자동으로 API로 폴백)
            const supabaseData = await getFindItems({
              pageNo: pageParam,
              numOfRows: 10,
            });
            if (supabaseData && supabaseData.length > 0) {
              return supabaseData;
            }
            // Supabase 데이터가 없으면 API로 변경
            console.log('Supabase 데이터 없음, API로 변경');
            setDataSource('api');
            return await getAllData({ pageNo: pageParam, numOfRows: 10 });
          } catch (error) {
            console.error('Supabase 데이터 가져오기 실패:', error);
            setDataSource('api');
            return await getAllData({ pageNo: pageParam, numOfRows: 10 });
          }

        case 'api':
          try {
            const apiData = await getAllData({
              pageNo: pageParam,
              numOfRows: 10,
            });
            if (apiData && apiData.length > 0) {
              return apiData;
            }
            // API 데이터도 없으면 샘플 데이터로 변경
            console.log('API 데이터 없음, 샘플 데이터로 변경');
            setDataSource('sample');
            setUseBackupData(true);
            return sampleData;
          } catch (error) {
            console.error('API 데이터 가져오기 실패:', error);
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
    console.log('현재 데이터 소스:', dataSource);
  }, [dataSource]);

  // 데이터 상태 로깅
  useEffect(() => {
    console.log(
      '데이터 상태:',
      data
        ? `${data.pages.length}개 페이지 로드됨, 항목 수: ${data.pages.reduce((acc, page) => acc + page.length, 0)}`
        : '데이터 없음'
    );

    if (isSuccess && data?.pages && data.pages.length > 0) {
      const totalItems = data.pages.reduce((acc, page) => acc + page.length, 0);
      console.log(`데이터 로드 성공! 총 ${totalItems}개 항목 로드됨`);

      // 실제 API 데이터가 있고 이전에 백업 데이터를 사용 중이었다면 전환
      if (useBackupData && totalItems > 0 && !hasSwitchedToRealData) {
        console.log('백업 데이터에서 실제 데이터로 전환합니다.');
        setUseBackupData(false);
        setHasSwitchedToRealData(true);
      }
    }
  }, [data, isSuccess, useBackupData, hasSwitchedToRealData]);

  // 오류 또는 시간 초과 시 백업 데이터로 전환
  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((isError || (!data && !isLoading)) && !useBackupData) {
        console.log('시간 초과 또는 API 오류, 백업 데이터 사용');
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
        // 동기화 스케줄러로 수동 동기화 시도
        SyncScheduler.getInstance()
          .manualSync()
          .then(() => {
            // 데이터 소스를 Supabase로 변경하고 다시 시도
            setDataSource('supabase');
            refetch();
          });
      }, 30000); // 30초마다 재시도
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [useBackupData, hasSwitchedToRealData, refetch]);

  const handleRetryRealData = () => {
    console.log('사용자가 실제 데이터 로드 재시도를 요청했습니다.');
    setDataSource('supabase');
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

  // 백업 데이터 사용 시 렌더링
  if (useBackupData) {
    return (
      <div className="flex h-screen w-full flex-col items-center bg-gray-200">
        <Header
          isShowSymbol={true}
          children="습득물 찾기"
          isShowSearch={true}
          link="/searchfind"
        />
        <div className="w-375px">
          <div
            ref={scrollContainerRef}
            className="h-[calc(100vh-66px-80px)] overflow-auto"
          >
            <ul className="flex flex-col items-center">
              {sampleData.map((item, index) => (
                <li key={index}>
                  <ItemBox item={mapAllDataToItemData(item)} itemType="get" />
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

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center bg-gray-200">
        <Header
          isShowSymbol={true}
          children="습득물 찾기"
          isShowSearch={true}
          link="/searchfind"
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

  // API 데이터가 비어있는 경우
  if (!data || !data.pages || data.pages.length === 0) {
    return (
      <div className="flex h-screen w-full flex-col items-center bg-gray-200">
        <Header
          isShowSymbol={true}
          children="습득물 찾기"
          isShowSearch={true}
          link="/searchfind"
        />
        <div className="w-375px">
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

  // 실제 데이터를 표시
  return (
    <div className="flex h-screen w-full flex-col items-center bg-gray-200">
      <Header
        isShowSymbol={true}
        children="습득물 찾기"
        isShowSearch={true}
        link="/searchfind"
      />
      <div className="w-375px">
        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-66px-80px)] overflow-auto"
        >
          {isSuccess && data.pages[0].length > 0 ? (
            <>
              <ul className="flex flex-col items-center">
                {data.pages.map((page: AllData[], pageIndex) =>
                  page.map((item, index) => (
                    <li key={`${pageIndex}-${index}`}>
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
              {hasSwitchedToRealData && (
                <div className="text-center text-xs text-green-600 my-2 animate-fade-out">
                  ✓ 실제 데이터로 업데이트 되었습니다
                </div>
              )}
              {dataSource === 'supabase' && (
                <div className="text-center text-xs text-gray-500 my-1">
                  (Supabase에서 데이터 로드됨)
                </div>
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
