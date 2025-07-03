import SwiperCore from 'swiper';
import { useQuery } from '@tanstack/react-query';
import ItemBox from './ItemBox';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getAllData } from '@/lib/utils/getAPIData';
import { Autoplay, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import '@/main.css';
import Skeleton from './Skeleton';

// ItemBox에서 사용하는 아이템 타입과 동일한 타입 정의
type ItemBoxType = {
  atcId: string;
  fdPrdtNm: string;
  lstPrdtNm: string;
  fdYmd: string;
  lstYmd: string;
  depPlace: string;
  lstPlace: string;
  fdFilePathImg: string;
};

SwiperCore.use([Autoplay, Pagination, Keyboard]);

const SwiperItem = () => {
  // API 데이터 가져오기
  const { data, isLoading } = useQuery({
    queryKey: ['swiperItems'],
    queryFn: async () => await getAllData({ pageNo: 1, numOfRows: 3 })
  });

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return <Skeleton />;
  }

  // API 응답이 없거나 배열이 아닌 경우 빈 배열로 처리
  const apiItems = Array.isArray(data) ? data : [];

  // 유효한 아이템만 필터링하고 타입 변환
  const validItems: ItemBoxType[] = apiItems
    .filter(
      (item): item is Record<string, any> =>
        item !== null &&
        typeof item === 'object' &&
        !Array.isArray(item) &&
        'atcId' in item &&
        'fdPrdtNm' in item &&
        'fdYmd' in item &&
        'depPlace' in item &&
        'fdFilePathImg' in item
    )
    .map((item) => ({
      atcId: String(item.atcId || ''),
      fdPrdtNm: String(item.fdPrdtNm || ''),
      lstPrdtNm: String(item.lstPrdtNm || ''),
      fdYmd: String(item.fdYmd || ''),
      lstYmd: String(item.lstYmd || ''),
      depPlace: String(item.depPlace || ''),
      lstPlace: String(item.lstPlace || ''),
      fdFilePathImg: String(item.fdFilePathImg || '')
    }));

  return (
    <Swiper
      autoplay
      keyboard
      loop
      spaceBetween={50}
      pagination={{
        bulletActiveClass: 'custom-bullet-active',
        bulletClass: 'custom-bullet'
      }}
    >
      {validItems.map((item, index) => (
        <SwiperSlide key={index}>
          <ItemBox itemType="main" item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperItem;
