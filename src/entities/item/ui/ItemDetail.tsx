import KakaoMap from '@/shared/ui/KakaoMap';
import { DetailData } from '@/types/types';
import { Camera, MapPin, Phone, Share2 } from 'lucide-react';

interface ItemDetailProps {
  detail: DetailData;
}

const ItemDetail = ({ detail }: ItemDetailProps) => {
  const handleShare = async () => {
    const sharePayload = {
      title: '찾아줘! 분실물 안내',
      text: detail.item_name || detail.storage || '찾아줘! 분실물 안내',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
        return;
      } catch (error) {
        console.warn('native share failed, fallback to clipboard', error);
      }
    }

    try {
      await navigator.clipboard.writeText(sharePayload.url);
      alert('공유하기를 지원하지 않는 브라우저입니다. 링크를 클립보드에 복사했어요.');
    } catch (clipboardError) {
      console.error('clipboard write failed', clipboardError);
      alert('링크 복사에도 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* 왼쪽: 이미지 및 상세 정보 */}
            <div className="p-4 md:p-8 md:border-r md:border-gray-200">
              {/* 이미지 영역 */}
              <div className="bg-gray-100 rounded-lg aspect-4/3 flex items-center justify-center mb-4 md:mb-8 overflow-hidden">
                {detail.image ? (
                  <img
                    src={detail.image}
                    alt={detail.item_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="w-16 h-16 md:w-24 md:h-24 mx-auto text-gray-400 mb-2 md:mb-4" />
                    <p className="text-sm md:text-base text-gray-500">이미지 준비중입니다.</p>
                  </div>
                )}
              </div>

              {/* 상세 정보 */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">{detail.item_name}</h2>

                  <div className="space-y-3 md:space-y-4">
                    <div className="flex border-b border-gray-100 pb-3">
                      <span className="w-20 md:w-24 text-sm md:text-base text-gray-600 shrink-0">습득장소</span>
                      <span className="text-sm md:text-base text-gray-900">{detail.place}</span>
                    </div>

                    <div className="flex border-b border-gray-100 pb-3">
                      <span className="w-20 md:w-24 text-sm md:text-base text-gray-600 shrink-0">습득일자</span>
                      <span className="text-sm md:text-base text-gray-900">{detail.date}</span>
                    </div>

                    <div className="flex border-b border-gray-100 pb-3">
                      <span className="w-20 md:w-24 text-sm md:text-base text-gray-600 shrink-0">관리번호</span>
                      <span className="text-sm md:text-base text-gray-900">{detail.id}</span>
                    </div>

                    <div className="flex border-b border-gray-100 pb-3">
                      <span className="w-20 md:w-24 text-sm md:text-base text-gray-600 shrink-0">물품분류</span>
                      <span className="text-sm md:text-base text-gray-900">{detail.item_type}</span>
                    </div>

                    <div className="flex pt-1">
                      <span className="w-20 md:w-24 text-sm md:text-base text-gray-600 shrink-0">상세내용</span>
                      <span className="text-sm md:text-base text-gray-900">{detail.description}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 지도 및 보관 정보 */}
            <div className="p-4 md:p-8 bg-gray-50">
              <div className="space-y-4 md:space-y-6">
                {/* 보관 장소 정보 */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">보관장소</h3>
                  <div className="bg-white rounded-lg p-3 md:p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                      <span className="text-sm md:text-base">{detail.storage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                      <span className="text-sm md:text-base text-gray-600">{detail.contact}</span>
                    </div>
                  </div>
                </div>

                {/* 지도 */}
                <div>
                  <div className="bg-gray-200 rounded-lg aspect-4/3 flex items-center justify-center relative overflow-hidden">
                    <KakaoMap place={detail.storage} className="w-full h-full" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-2 text-center">
                    지도에서 보관 장소의 위치를 확인하세요
                  </p>
                </div>

                {/* 공유하기 버튼 */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  공유하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
