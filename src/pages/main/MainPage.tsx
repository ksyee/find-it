import { pb } from '@/lib/utils/pb';
import { Link } from 'react-router-dom';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';
import Header from '@/widgets/header/ui/Header';
import Shortcut from '@/widgets/shortcut/ui/Shortcut';
import SwiperItem from '@/widgets/item-swiper/ui/SwiperItem';
import icon_right from '@/assets/icons/icon_right.svg';
import icon_search from '@/assets/icons/icon_search_36.svg';
import * as React from 'react';
const { useState, useEffect } = React;

/* -------------------------------------------------------------------------- */
/*                                  유저 이름 렌더링                              */
/* -------------------------------------------------------------------------- */

// 로그인시 로컬 스토리지에 저장된 유저 닉네임 가져오기
const loginUserData = localStorage.getItem('pocketbase_auth');
const localData = loginUserData && JSON.parse(loginUserData);
const userNickname = localData?.model?.nickname;

// 타입 지정
interface ProfileBoxProps {
  userName?: string;
}

// 프로필 영역
const ProfileBox = ({
  userName = userNickname || '방문자'
}: ProfileBoxProps) => {
  let profileName: string;
  if (userNickname?.length > 5) {
    profileName = `${userName.slice(0, 4)}...`;
  } else {
    profileName = userName;
  }

  return (
    <article className="bg-skyblue-300 h-[140px] w-[180px] rounded-2xl transition-all duration-300 hover:shadow-lg md:w-[240px] md:h-[160px] lg:w-[320px] lg:h-[180px]">
      <Link
        to="/mypageentry"
        className="block h-full p-5 md:p-6 lg:p-8"
        aria-label={`${profileName}님의 마이페이지로 이동`}
      >
        <p className="text-[17px] font-medium md:text-[20px] lg:text-[24px]">
          <span className="flex items-baseline">
            <strong className="text-[24px] font-medium md:text-[28px] lg:text-[32px]">{profileName}</strong>
            <span className="ml-0.5">님</span>
          </span>
          <span className="block">안녕하세요!</span>
        </p>
      </Link>
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 물품 찾기 박스                                */
/* -------------------------------------------------------------------------- */
const FindItemBox = () => {
  return (
    <div className="relative h-[140px] w-[140px] rounded-2xl bg-gray-200 p-5 transition-all duration-300 hover:shadow-lg md:w-[180px] md:h-[160px] lg:w-[240px] lg:h-[180px]">
      <Link
        to="/searchfind"
        className="flex h-full w-full flex-col"
        aria-label="물품 찾기 페이지로 이동"
      >
        <span className="text-xl font-medium md:text-2xl lg:text-3xl">물품 찾기</span>
        <img
          src={icon_search}
          className="absolute right-5 bottom-5 h-9 w-9 md:h-11 md:w-11 lg:h-12 lg:w-12"
          alt=""
          aria-hidden="true"
        />
      </Link>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                             자유게시판 최근 게시물 렌더링                             */
/* -------------------------------------------------------------------------- */

const CommunityBox: React.FC = () => {
  const [posts, setPosts] = useState<{ title: string; created: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await pb
          .collection('community')
          .getList(1, 2, { sort: '-created' });
        setPosts(
          res.items.map((item) => ({
            title: item.title,
            created: item.created
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        게시물을 불러오는 중입니다...
      </div>
    );
  }
  if (posts.length === 0) {
    return <div role="status">표시할 게시물이 없습니다.</div>;
  }

  return (
    <section aria-labelledby="community-section-title">
      <Link to="/postlist" className="block" aria-label="자유게시판 전체보기">
        <div className="mb-5 flex flex-col gap-5 rounded-2xl border border-black p-5 transition-all duration-300 hover:cursor-pointer hover:shadow-lg">
          <div className="flex items-center justify-between">
            <h2 id="community-section-title" className="text-xl">
              자유게시판
            </h2>
            <img
              src={icon_right}
              alt="자유게시판 전체보기"
              aria-hidden="true"
            />
          </div>
          <ul>
            {posts.map((post, idx) => (
              <li key={idx} className="flex items-baseline gap-2 pb-1">
                <span className="text-sm">{post.title || '–'}</span>
                <span className="text-2xs text-gray-500">
                  {getTimeDiff({ createdAt: post.created })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*                                메인페이지 렌더링                              */
/* -------------------------------------------------------------------------- */
const Main = () => {
  return (
    <div className="flex w-full flex-col items-center bg-white min-h-screen pt-[66px]">
      <Header isShowLogo={true} />
      <main id="main-content" className="w-full lg:max-w-[1280px]">
        <div className="px-5 md:px-8 lg:px-8 xl:px-12">
          <div className="flex gap-4 lg:gap-6">
            <ProfileBox />
            <FindItemBox />
          </div>
          <div className="pt-3 pb-[5px] pl-[10px] lg:pt-6 lg:pb-4">
            <Shortcut
              link="/getlist"
              text="주인을 찾아요!"
              alt="습득물 페이지 바로가기"
            />
          </div>
          <SwiperItem />
          <CommunityBox />
        </div>
      </main>
    </div>
  );
};

export default Main;
