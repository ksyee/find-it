import { useEffect, useState } from 'react';
import { supabase } from '@/lib/api/supabase';
import Horizon from '@/components/common/atom/Horizon';
import icon_bell from '@/assets/icons/icon_bell.svg';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';

interface KeywordType {
  keywords: string;
}

interface RecommendationType {
  id: string;
  receiveTime: string;
  regionString: string;
  organizationName: string;
  productName: string;
  foundDate: string;
  foundPlace: string;
  userName: string;
  keywordName: string;
}

const Notice = () => {
  const [userKeywordData, setUserKeywordData] = useState<KeywordType>({
    keywords: '',
  });
  const [recommendations, setRecommendations] = useState<RecommendationType[]>(
    []
  );

  useEffect(() => {
    (async () => {
      const supabaseAuth = localStorage.getItem('supabase_auth');
      const supabaseData = supabaseAuth ? JSON.parse(supabaseAuth) : null;
      const userId = supabaseData?.session?.user?.id;

      if (userId) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('keywords')
            .eq('id', userId)
            .single();

          if (error) throw error;

          if (data && data.keywords) {
            setUserKeywordData({ keywords: data.keywords });
          }
        } catch (error) {
          console.error('키워드 가져오기 에러:', error);
        }
      }
    })();
  }, []);

  return (
    <div className="w-375px">
      <div className="text-center text-14px">
        {!userKeywordData.keywords ? (
          <section className="flex flex-col items-center py-80px">
            <img
              src={icon_bell}
              alt="키워드 등록 필요"
              className="h-32px w-32px"
            ></img>
            <p className="pt-20px text-center text-14px">
              키워드를 등록하면 관련 알림을 볼 수 있어요.
            </p>
          </section>
        ) : (
          <ul className="px-30px">
            {userKeywordData.keywords.split(', ').map((keyword) => {
              // 로컬 스토리지에서 키워드별 알림 정보 가져오기
              const savedRecommendations = localStorage.getItem(
                `recommendations_${keyword}`
              );
              if (savedRecommendations) {
                try {
                  const parsedRecommendations: RecommendationType[] =
                    JSON.parse(savedRecommendations);
                  if (parsedRecommendations.length > 0) {
                    return (
                      <li key={keyword} className="pb-25px text-14px">
                        <p className="pb-10px text-left">
                          <span className="text-primary">{keyword}</span> 키워드
                          관련 습득물 알림
                        </p>
                        {parsedRecommendations.map((rec, index) => (
                          <button
                            key={index}
                            className="w-full pb-20px text-left"
                            onClick={() => {
                              window.open(
                                `https://www.lost112.go.kr/find/findDetail.do?FIND_IDNTFCTN_NO=${rec.id}`
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                window.open(
                                  `https://www.lost112.go.kr/find/findDetail.do?FIND_IDNTFCTN_NO=${rec.id}`
                                );
                              }
                            }}
                            aria-label={`${rec.productName} 습득물 상세정보 보기`}
                          >
                            <div className="flex justify-between text-12px">
                              <p className="text-gray-400">
                                {rec.organizationName}
                              </p>
                              <p className="text-gray-400">
                                {getTimeDiff({ createdAt: rec.receiveTime })}
                              </p>
                            </div>
                            <p className="pb-5px pt-15px text-15px">
                              {rec.productName}
                            </p>
                            <p className="text-black-500 text-13px">
                              습득장소: {rec.foundPlace}
                            </p>
                            <p className="text-black-500 text-13px">
                              습득일자: {rec.foundDate}
                            </p>
                            <Horizon lineBold="thin" lineWidth="short" />
                          </button>
                        ))}
                      </li>
                    );
                  }
                } catch (error) {
                  console.error(
                    `Error parsing recommendations for ${keyword}:`,
                    error
                  );
                }
              }
              return null;
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notice;
