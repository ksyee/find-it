import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/api/supabase';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';
import Header from '@/components/Header/Header';
import Shortcut from '@/components/Shortcut/Shortcut';
import SwiperItem from '@/components/ItemBox/SwiperItem';
import Navigation from '@/components/Navigation/Navigation';
import icon_right from '@/assets/icons/icon_right.svg';
import icon_search from '@/assets/icons/icon_search_36.svg';
import logoSymbol from '@/assets/icons/LOGO_SYMBOL.svg';

/* -------------------------------------------------------------------------- */
/*                                  유저 이름 렌더링                              */
/* -------------------------------------------------------------------------- */

// 로그인시 로컬 스토리지에 저장된 유저 닉네임 가져오기
const loginUserData = localStorage.getItem('supabase_auth');
const localData = loginUserData && JSON.parse(loginUserData);
const userNickname = localData?.user?.user_metadata?.nickname;

// 타입 지정
interface ProfileBoxProps {
  userName?: string;
}

// 프로필 영역
const ProfileBox = ({ userName }: ProfileBoxProps) => {
  const name = userName || userNickname || '로그인';
  return (
    <Link
      to="/mypageentry"
      className="relative flex h-120px w-164px flex-col items-center justify-center gap-1.5 rounded-20px border border-black transition-all duration-300 hover:cursor-pointer hover:shadow-lg"
    >
      <span className="z-0 size-52px rounded-full bg-gray-100 ">
        <img
          src={logoSymbol}
          alt="나의 프로필 보기"
          className=" mx-auto my-auto pt-3 "
        />
      </span>
      <span className="text-12px text-slate-500">{name}</span>
      <span className="rounded-20px bg-primary px-2 py-0.5 text-10px text-white">
        내 정보 관리
      </span>
    </Link>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 물품 찾기 박스                                */
/* -------------------------------------------------------------------------- */
const FindItemBox = () => {
  return (
    <Link
      to="/lostlist"
      className="relative flex h-120px w-164px flex-col items-center justify-center gap-1.5 rounded-20px border border-black transition-all duration-300 hover:cursor-pointer hover:shadow-lg"
    >
      <span className="z-0 size-52px rounded-full bg-green-100 ">
        <img
          src={logoSymbol}
          alt="분실물 찾기"
          className=" mx-auto my-auto pt-3 "
        />
      </span>
      <span className="text-12px text-slate-500">분실물</span>
      <span className="rounded-20px bg-primary px-2 py-0.5 text-10px text-white">
        잃어버린 물건 찾기
      </span>
    </Link>
  );
};

/* -------------------------------------------------------------------------- */
/*                             자유게시판 최근 게시물 렌더링                             */
/* -------------------------------------------------------------------------- */

interface Post {
  title: string;
  created_at: string;
}

const CommunityBox = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('community')
          .select('title, created_at')
          .order('created_at', { ascending: false })
          .limit(2);

        if (error) throw error;

        if (data) {
          setRecentPosts(data);
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error);
        setError('게시물을 불러오는데 실패했습니다.');
        setRecentPosts([
          {
            title: '샘플 게시물 1',
            created_at: new Date().toISOString(),
          },
          {
            title: '샘플 게시물 2',
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <Link to="/postlist" className="block">
      <div className="mb-5 flex h-140px w-335px flex-col gap-20px rounded-20px border border-black p-5 transition-all duration-300 hover:cursor-pointer hover:shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-20px">자유게시판</h1>
          <img src={icon_right} alt="자유게시판 바로가기" />
        </div>
        <div className="">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="text-14px">로딩중...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center">
              <span className="text-14px text-gray-500">
                임시 데이터를 표시합니다
              </span>
            </div>
          ) : (
            recentPosts.map((post, index) => (
              <div key={index} className="flex items-center gap-2 pb-1">
                <span className="text-14px">{post.title}</span>
                {getTimeDiff({ createdAt: post.created_at })}
              </div>
            ))
          )}
        </div>
      </div>
    </Link>
  );
};

/* -------------------------------------------------------------------------- */
/*                                메인페이지 렌더링                               */
/* -------------------------------------------------------------------------- */
const Main = () => {
  return (
    <>
      <div className="flex w-full flex-col items-center">
        <Header isShowLogo={true} />
        <div className="w-375px px-5">
          <div className="flex gap-4">
            <ProfileBox />
            <FindItemBox />
          </div>
          <div className="pb-5px pl-10px pt-3">
            <Shortcut
              link="/getlist"
              text="주인을 찾아요!"
              alt="습득물 페이지 바로가기"
            />
          </div>
          <SwiperItem />
          <CommunityBox />
        </div>
        <Navigation />
      </div>
    </>
  );
};

export default Main;
