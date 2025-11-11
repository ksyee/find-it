import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import default_item from '@/assets/itembox/default_item.svg';

type itemTypeProps = {
  itemType: 'get' | 'lost' | 'main';
  item?: {
    atcId: string;
    fdPrdtNm: string;
    lstPrdtNm: string;
    fdYmd: string;
    lstYmd: string;
    depPlace: string;
    lstPlace: string;
    fdFilePathImg: string;
  };
};
interface GetItemType {
  get_item_name: string;
  get_date: string;
  storage: string;
  get_item_image: string;
}

interface LostItemType {
  lost_item_name: string;
  lost_date: string;
  lost_place: string;
}

const ItemBox = ({ itemType, item }: itemTypeProps) => {
  const [getItemData, setGetItemData] = useState<GetItemType | null>(null);
  const [lostItemData, setLostItemData] = useState<LostItemType | null>(null);
  const navigate = useNavigate();

  const handleClickedItem = (id: string) => {
    itemType === 'get' && navigate(`/getlist/detail/${id}`);
    itemType === 'main' && navigate(`/getlist/detail/${id}`);
    itemType === 'lost' && navigate(`/lostlist/detail/${id}`);
  };

  useEffect(() => {
    if (
      item &&
      item.fdPrdtNm &&
      item.fdYmd &&
      item.depPlace &&
      item.fdFilePathImg
    ) {
      const newGetItem: GetItemType = {
        get_item_name: item.fdPrdtNm,
        get_date: item.fdYmd,
        storage: item.depPlace,
        get_item_image: item.fdFilePathImg
      };
      setGetItemData(newGetItem);
    }
  }, [item]);

  useEffect(() => {
    if (item && item.lstPrdtNm && item.lstYmd && item.lstPlace) {
      const newLostItem: LostItemType = {
        lost_item_name: item.lstPrdtNm,
        lost_date: item.lstYmd,
        lost_place: item.lstPlace
      };
      setLostItemData(newLostItem);
    }
  }, [item]);

  return (
    <div>
      {itemType === 'get' && getItemData && (
        <button
          className="block w-full"
          onClick={() => item && handleClickedItem(item.atcId)}
        >
          <div className="mb-3 flex h-[140px] w-full justify-between rounded-[20px] bg-white transition-all duration-300 hover:cursor-pointer hover:shadow-lg lg:h-[160px]">
            <div className="flex flex-col items-start py-[18px] pl-5 flex-1 min-w-0">
              <h1 className="pb-2 text-xl leading-[1.3] font-medium tracking-tighter text-left w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {getItemData.get_item_name}
              </h1>
              <span className="bg-primary rounded-full px-3 py-1 text-[10px] leading-[1.3] font-medium tracking-tighter text-white truncate max-w-full">
                {getItemData.storage}
              </span>

              <div className="mt-[13px] flex flex-col gap-1">
                <span className="text-start text-xs leading-[1.3] font-medium tracking-tighter text-gray-500">
                  습득날짜
                </span>
                <span className="text-xs leading-[1.3] font-medium tracking-tighter">
                  {getItemData.get_date}
                </span>
              </div>
            </div>

            <div className="p-[10px] flex-shrink-0">
              <img
                src={
                  getItemData.get_item_image ===
                  'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif'
                    ? default_item
                    : getItemData.get_item_image
                }
                alt="물품 사진"
                className="size-[120px] rounded-[14px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </button>
      )}

      {itemType === 'lost' && lostItemData && (
        <button
          className="block w-full"
          onClick={() => item && handleClickedItem(item.atcId)}
        >
          <div className="mb-3 flex h-[140px] w-full justify-between rounded-[20px] bg-white transition-all duration-300 hover:cursor-pointer hover:shadow-lg lg:h-[160px]">
            <div className="flex flex-col items-start py-[18px] pl-5 flex-1 min-w-0">
              <h1 className="pb-2 text-xl leading-[1.3] font-medium tracking-tighter text-left w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {lostItemData.lost_item_name}
              </h1>
              <span className="border-primary text-primary rounded-full border-[1px] px-3 py-[3px] text-[10px] leading-[1.3] font-medium tracking-tighter truncate max-w-full">
                {lostItemData.lost_place}
              </span>

              <div className="mt-[13px] flex flex-col gap-1">
                <span className="text-start text-xs leading-[1.3] font-medium tracking-tighter text-gray-500">
                  분실날짜
                </span>
                <span className="text-xs leading-[1.3] font-medium tracking-tighter">
                  {lostItemData.lost_date}
                </span>
              </div>
            </div>

            <div className="p-[10px] flex-shrink-0">
              <img
                src={default_item}
                alt="등록된 사진이 없습니다."
                className="size-[120px] rounded-[14px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </button>
      )}

      {itemType === 'main' && getItemData && (
        <button
          className="block w-full"
          onClick={() => item && handleClickedItem(item.atcId)}
        >
          <div className="bg-gradient-to-br from-[#4F7EFF] to-[#3B63E3] rounded-3xl p-6 transition-all duration-300 hover:cursor-pointer hover:shadow-lg md:p-8 w-full">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-white mb-3 text-xl md:text-2xl font-medium">
                  {getItemData.get_item_name.length > 10
                    ? getItemData.get_item_name.slice(0, 10) + '...'
                    : getItemData.get_item_name}
                </h2>
                <div className="inline-block bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
                  <span className="text-white text-xs">{getItemData.storage}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-white/80 text-sm">습득일자</p>
                  <p className="text-white">{getItemData.get_date}</p>
                </div>
              </div>
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src={
                    getItemData.get_item_image ===
                    'https://www.lost112.go.kr/lostnfs/images/sub/img02_no_img.gif'
                      ? default_item
                      : getItemData.get_item_image
                  }
                  alt="물품 사진"
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default ItemBox;
