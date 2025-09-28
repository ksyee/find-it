import SwiperCore from 'swiper';
import { useQuery } from '@tanstack/react-query';
import ItemBox from '@/entities/item/ui/ItemBox';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getFoundItems } from '@/entities/found/api/getFoundItems';
import { Autoplay, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import '@/main.css';
import Skeleton from '@/entities/item/ui/Skeleton';
import { AllData } from '@/types/types';

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
    queryFn: async () => await getFoundItems(0, 3)
  });

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return <Skeleton />;
  }

  // API 응답이 없거나 배열이 아닌 경우 빈 배열로 처리
  const apiItems: AllData[] = Array.isArray(data) ? (data as AllData[]) : [];

  // 타입 변환
  const validItems: ItemBoxType[] = apiItems.map((item) => ({
    atcId: item.atcId,
    fdPrdtNm: item.fdPrdtNm,
    lstPrdtNm: item.lstPrdtNm,
    fdYmd: item.fdYmd,
    lstYmd: item.lstYmd,
    depPlace: item.depPlace,
    lstPlace: item.lstPlace,
    fdFilePathImg: item.fdFilePathImg
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
