import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import default_item from '@/assets/itembox/default_item.svg';

export type ItemType = 'get' | 'lost' | 'main';

export interface ItemData {
  atcId: string;
  fdPrdtNm?: string;
  lstPrdtNm?: string;
  fdYmd?: string;
  lstYmd?: string;
  depPlace?: string;
  lstPlace?: string;
  fdFilePathImg?: string;
  lstFilePathImg?: string;
}

interface ItemBoxProps {
  itemType: ItemType;
  item: ItemData;
}

/**
 * 습득물/분실물 항목을 표시하는 컴포넌트
 * @param itemType - 항목 유형 (get: 습득물, lost: 분실물, main: 메인 화면용)
 * @param item - 표시할 항목 데이터
 */
const ItemBox: React.FC<ItemBoxProps> = ({ itemType, item }) => {
  const navigate = useNavigate();

  // 데이터 구조화
  const itemData = useMemo(() => {
    if (!item) return null;

    switch (itemType) {
      case 'get':
      case 'main':
        return {
          id: item.atcId,
          title: item.fdPrdtNm || '제목 없음',
          location: item.depPlace || '장소 정보 없음',
          date: item.fdYmd || '날짜 정보 없음',
          image: item.fdFilePathImg || '',
          dateLabel: '습득날짜',
          route: `/getlist/detail/${item.atcId}`,
        };
      case 'lost':
        return {
          id: item.atcId,
          title: item.lstPrdtNm || '제목 없음',
          location: item.lstPlace || '장소 정보 없음',
          date: item.lstYmd || '날짜 정보 없음',
          image: item.lstFilePathImg || '',
          dateLabel: '분실날짜',
          route: `/lostlist/detail/${item.atcId}`,
        };
      default:
        return null;
    }
  }, [item, itemType]);

  // 항목을 클릭했을 때 상세 페이지로 이동
  const handleClickedItem = () => {
    if (itemData?.route) {
      navigate(itemData.route);
    }
  };

  // 표시할 데이터가 없으면 렌더링하지 않음
  if (!itemData) return null;

  // 제목이 길면 축약
  const displayTitle =
    itemData.title.length > 10
      ? itemData.title.slice(0, 8) + '...'
      : itemData.title;

  // 이미지 URL이 기본 이미지이거나 없으면 대체 이미지 사용
  const imageUrl =
    !itemData.image ||
    itemData.image ===
      'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif'
      ? default_item
      : itemData.image;

  return (
    <button className="block mx-auto" onClick={handleClickedItem}>
      <div className="mb-12px flex h-140px w-335px items-center justify-between rounded-20px bg-white pl-20px pr-10px shadow">
        <div className="flex-grow space-y-3">
          <h1 className="h-26px text-20px font-medium leading-[1.3] tracking-tighter">
            {displayTitle}
          </h1>
          <span className="h-21px w-fit rounded-full bg-primary px-3 py-1 text-10px font-medium leading-[1.3] tracking-tighter text-white">
            {itemData.location}
          </span>
          <div className="flex flex-col gap-1">
            <span className="h-16px text-12px font-medium leading-[1.3] tracking-tighter text-gray-500">
              {itemData.dateLabel}
            </span>
            <span className="h-16px text-12px font-medium leading-[1.3] tracking-tighter">
              {itemData.date}
            </span>
          </div>
        </div>

        <div className="h-120px w-120px rounded-14px overflow-hidden">
          <img
            src={imageUrl}
            alt={
              itemType === 'lost' && !itemData.image
                ? '등록된 사진이 없습니다.'
                : '물품 사진'
            }
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </button>
  );
};

export default ItemBox;
