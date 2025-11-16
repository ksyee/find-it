import { Link } from 'react-router-dom';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';
import { Search, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { useFoundItemsInfinite } from '@/entities/found/model/useFoundItemsInfinite';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { supabase } from '@/lib/api/supabaseClient';
import { fetchProfileById } from '@/lib/api/profile';
import { fetchRecentCommunityPosts } from '@/lib/api/community';
import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';
import { logger } from '@/lib/utils/logger';
import formatDisplayDate from '@/lib/utils/formatDisplayDate';
const { useState, useEffect } = React;

// 유저 이름 렌더링
interface ProfileBoxProps {
  userName?: string;
}

// 프로필 영역
const ProfileBox = ({ userName = '방문자' }: ProfileBoxProps) => {
  const targetName = userName || '방문자';
  const profileName =
    targetName.length > 5 ? `${targetName.slice(0, 4)}...` : targetName;

  return (
    <button className="flex-1 rounded-2xl bg-[#E3EFFF] p-6 text-left transition-colors hover:bg-[#d5e5ff] md:p-8">
      <Link
        to="/mypageentry"
        className="block"
        aria-label={`${profileName}님의 마이페이지로 이동`}
      >
        <div className="space-y-1">
          <h3 className="text-[#1a1a1a]">{profileName}님</h3>
          <p className="text-sm text-[#666]">안녕하세요!</p>
        </div>
      </Link>
    </button>
  );
};

const FindItemBox = () => {
  return (
    <button className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-white p-6 transition-colors hover:bg-gray-50 md:p-8">
      <Link
        to="/searchfind"
        className="w-full space-y-2 text-center"
        aria-label="물품 찾기 페이지로 이동"
      >
        <h3 className="text-[#1a1a1a]">물품 찾기</h3>
        <Search className="mx-auto h-8 w-8 text-[#1a1a1a]" />
      </Link>
    </button>
  );
};

const CommunityBox: React.FC = () => {
  const [posts, setPosts] = useState<{ id: string; title: string; created: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetchRecentCommunityPosts(2);
        setPosts(
          data.map((item) => ({
            id: item.id,
            title: item.title,
            created: item.created_at
          }))
        );
      } catch (error) {
        logger.error('자유게시판 데이터를 불러오지 못했습니다.', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
        <p className="text-[#666]">게시물을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 md:mt-8 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[#1a1a1a]">자유게시판</h3>
        <Link to="/postlist" aria-label="자유게시판 전체보기">
          <ChevronRight className="h-5 w-5 text-[#1a1a1a]" />
        </Link>
      </div>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-sm text-[#999]">표시할 게시물이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              to={`/postdetail/${post.id}`}
              className="-mx-2 flex items-center justify-between rounded-lg border-b border-gray-100 px-2 py-2 transition-colors hover:bg-gray-50"
            >
              <div className="flex-1">
                <p className="text-[#1a1a1a]">{post.title || '–'}</p>
              </div>
              <span className="text-sm text-[#999]">
                {getTimeDiff({ createdAt: post.created })}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const RecommendedItems: React.FC = () => {
  const { data, isLoading } = useFoundItemsInfinite({
    pageSize: 5,
    query: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30
    }
  });

  const items = data?.pages?.flatMap((page) => page) ?? [];

  if (isLoading) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-[#666]">추천을 찾아요!</span>
          <Link
            to="/getlist"
            className="flex items-center transition-colors hover:text-[#4F7EFF]"
          >
            <span className="text-xs text-[#999]">전체보기</span>
            <ChevronRight className="ml-1 h-4 w-4 text-[#999]" />
          </Link>
        </div>
        <div className="mb-6 animate-pulse rounded-3xl bg-gradient-to-br from-[#4F7EFF] to-[#3B63E3] p-6 md:mb-8 md:p-8">
          <div className="h-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-[#666]">추천을 찾아요!</span>
        <Link
          to="/getlist"
          className="flex items-center transition-colors hover:text-[#4F7EFF]"
        >
          <span className="text-xs text-[#999]">전체보기</span>
          <ChevronRight className="ml-1 h-4 w-4 text-[#999]" />
        </Link>
      </div>

      {items.length > 0 ? (
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white'
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false
          }}
          loop={items.length > 1}
          className="mb-6 md:mb-8"
        >
          {items.map((item) => (
            <SwiperSlide key={item.atcId}>
              <Link to={`/getlist/detail/${item.atcId}`} className="block">
                <div className="rounded-3xl bg-linear-to-br from-[#5B82FF] to-[#4F7EFF] p-6 transition-shadow hover:shadow-lg md:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="mb-3 text-xl font-semibold text-white md:text-2xl">
                        {item.fdPrdtNm.length > 12
                          ? item.fdPrdtNm.slice(0, 12) + '...'
                          : item.fdPrdtNm}
                      </h2>
                      <div className="mb-4 inline-block rounded-full bg-white/30 px-3 py-1 backdrop-blur-sm">
                        <span className="text-xs font-medium text-white">
                          {item.depPlace}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-white/80">습득일자</p>
                        <p className="font-medium text-white">
                          {formatDisplayDate(item.fdYmd)}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur-sm">
                      <img
                        src={item.fdFilePathImg}
                        alt={item.fdPrdtNm}
                        className="h-full w-full rounded-2xl object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-[#5B82FF] to-[#4F7EFF] p-6 md:mb-8 md:p-8">
          <p className="text-center text-white">등록된 습득물이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

const Main = () => {
  const [userNickname, setUserNickname] = useState('방문자');

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;

      try {
        const profileData = await fetchProfileById(user.id);
        if (profileData?.nickname) {
          setUserNickname(profileData.nickname);
        } else if (user.email) {
          setUserNickname(user.email);
        }
      } catch (error) {
        logger.error('사용자 정보를 불러오지 못했습니다.', error);
      }
    };

    void loadProfile();
  }, []);

  useHeaderConfig(
    () => ({
      isShowLogo: true
    }),
    []
  );

  return (
    <div className="min-h-nav-safe flex flex-col bg-[#f8f8f8]">
      <main className="flex-1 pb-20 md:pb-8">
        <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <ProfileBox userName={userNickname} />
            <FindItemBox />
            <RecommendedItems />
            <div className="space-y-6 md:space-y-8">
              <CommunityBox />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
