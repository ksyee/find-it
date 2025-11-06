import { pb } from '@/lib/utils/pb';
import { Link } from 'react-router-dom';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';
import {
  Home,
  FileText,
  Package,
  MessageSquare,
  User,
  Search,
  ChevronRight,
} from 'lucide-react';
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
    <button className="bg-[#E3EFFF] rounded-2xl p-6 text-left hover:bg-[#d5e5ff] transition-colors md:p-8 flex-1">
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

/* -------------------------------------------------------------------------- */
/*                                 물품 찾기 박스                                */
/* -------------------------------------------------------------------------- */
const FindItemBox = () => {
  return (
    <button className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors md:p-8 flex-1">
      <Link
        to="/searchfind"
        className="space-y-2 text-center w-full"
        aria-label="물품 찾기 페이지로 이동"
      >
        <h3 className="text-[#1a1a1a]">물품 찾기</h3>
        <Search className="w-8 h-8 mx-auto text-[#1a1a1a]" />
      </Link>
    </button>
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
      <div className="bg-white rounded-3xl p-6 border border-gray-200 md:p-8">
        <p className="text-[#666]">게시물을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1a1a1a]">자유게시판</h3>
        <Link to="/postlist" aria-label="자유게시판 전체보기">
          <ChevronRight className="w-5 h-5 text-[#1a1a1a]" />
        </Link>
      </div>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-sm text-[#999]">표시할 게시물이 없습니다.</p>
        ) : (
          posts.map((post, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex-1">
                <p className="text-[#1a1a1a]">{post.title || '–'}</p>
              </div>
              <span className="text-sm text-[#999]">
                {getTimeDiff({ createdAt: post.created })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                             추천 습득물 섹션                                  */
/* -------------------------------------------------------------------------- */
const RecommendedItems: React.FC = () => {
  return (
    <div>
      {/* Recommendations Section Header */}
      <div className="mb-3 flex items-center">
        <span className="text-sm text-[#666]">추천을 찾아요!</span>
        <Link to="/getlist">
          <ChevronRight className="w-4 h-4 text-[#666] ml-1" />
        </Link>
      </div>

      {/* Featured Card */}
      <div className="bg-gradient-to-br from-[#4F7EFF] to-[#3B63E3] rounded-3xl p-6 mb-6 md:p-8 md:mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-white mb-3">여성카드지갑</h2>
            <div className="inline-block bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <span className="text-white text-xs">핵심상세</span>
            </div>
            <div className="space-y-1">
              <p className="text-white/80 text-sm">습득일자</p>
              <p className="text-white">2025-09-26</p>
            </div>
          </div>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#B8D4FF] to-[#6B9EFF] rounded-lg transform rotate-12 flex items-center justify-center">
              <div className="w-3 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Additional Cards */}
      <div className="hidden md:grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-4 hover:shadow-md transition-shadow md:p-6">
          <div className="inline-block bg-[#4F7EFF]/10 rounded-full px-3 py-1 mb-2">
            <span className="text-[#4F7EFF] text-xs">습득물</span>
          </div>
          <h4 className="text-[#1a1a1a] mb-1">에어팟 케이스</h4>
          <p className="text-sm text-[#999]">2025-09-25</p>
        </div>
        <div className="bg-white rounded-2xl p-4 hover:shadow-md transition-shadow md:p-6">
          <div className="inline-block bg-[#4F7EFF]/10 rounded-full px-3 py-1 mb-2">
            <span className="text-[#4F7EFF] text-xs">습득물</span>
          </div>
          <h4 className="text-[#1a1a1a] mb-1">검은색 우산</h4>
          <p className="text-sm text-[#999]">2025-09-24</p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                             최근 활동 섹션 (데스크탑)                           */
/* -------------------------------------------------------------------------- */
const RecentActivity: React.FC = () => {
  return (
    <div className="hidden md:block mt-6 md:mt-8">
      <div className="bg-gradient-to-br from-[#F0F4FF] to-[#E3EFFF] rounded-3xl p-6 md:p-8">
        <h3 className="text-[#1a1a1a] mb-3">최근 활동</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4F7EFF] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#1a1a1a]">새로운 습득물 등록</p>
              <p className="text-xs text-[#999]">5분 전</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4F7EFF]/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#4F7EFF]" />
            </div>
            <div>
              <p className="text-sm text-[#1a1a1a]">새 댓글이 달렸습니다</p>
              <p className="text-xs text-[#999]">1시간 전</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                메인페이지 렌더링                              */
/* -------------------------------------------------------------------------- */
const Main = () => {
  const [activeTab, setActiveTab] = useState('home');
  const isLoggedIn = localStorage.getItem('pocketbase_auth');

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col">
      {/* Desktop Top Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/">
                <h2 className="text-[#4F7EFF]">찾아줘!</h2>
              </Link>
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'home'
                      ? 'text-[#4F7EFF] bg-[#4F7EFF]/10'
                      : 'text-[#666] hover:text-[#4F7EFF]'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <Link to="/">
                    <span>홈</span>
                  </Link>
                </button>
                <button
                  onClick={() => setActiveTab('found')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'found'
                      ? 'text-[#4F7EFF] bg-[#4F7EFF]/10'
                      : 'text-[#666] hover:text-[#4F7EFF]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <Link to="/getlist">
                    <span>습득물</span>
                  </Link>
                </button>
                <button
                  onClick={() => setActiveTab('lost')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'lost'
                      ? 'text-[#4F7EFF] bg-[#4F7EFF]/10'
                      : 'text-[#666] hover:text-[#4F7EFF]'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <Link to="/lostlist">
                    <span>분실물</span>
                  </Link>
                </button>
                <button
                  onClick={() => setActiveTab('board')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'board'
                      ? 'text-[#4F7EFF] bg-[#4F7EFF]/10'
                      : 'text-[#666] hover:text-[#4F7EFF]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <Link to="/postlist">
                    <span>자유게시판</span>
                  </Link>
                </button>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'login'
                  ? 'text-white bg-[#4F7EFF]'
                  : 'text-[#4F7EFF] border border-[#4F7EFF] hover:bg-[#4F7EFF]/10'
              }`}
            >
              <User className="w-4 h-4" />
              <Link to={isLoggedIn ? '/mypage' : '/signin'}>
                <span>{isLoggedIn ? '마이페이지' : '로그인'}</span>
              </Link>
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Top Padding */}
      <div className="hidden md:block h-16"></div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-[#4F7EFF] text-center md:text-left">찾아줘!</h1>
          </header>

          {/* Top Action Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6 md:gap-6">
            <ProfileBox />
            <FindItemBox />
          </div>

          {/* Desktop Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Recommendations */}
            <RecommendedItems />

            {/* Right Column - Community Board */}
            <div>
              <CommunityBox />
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="grid grid-cols-5 h-16">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'home' ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <Link to="/" className="flex flex-col items-center justify-center gap-1">
              <Home className="w-5 h-5" />
              <span className="text-xs">홈</span>
            </Link>
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'found' ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <Link to="/getlist" className="flex flex-col items-center justify-center gap-1">
              <FileText className="w-5 h-5" />
              <span className="text-xs">습득물</span>
            </Link>
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'lost' ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <Link to="/lostlist" className="flex flex-col items-center justify-center gap-1">
              <Package className="w-5 h-5" />
              <span className="text-xs">분실물</span>
            </Link>
          </button>
          <button
            onClick={() => setActiveTab('board')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'board' ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <Link to="/postlist" className="flex flex-col items-center justify-center gap-1">
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs">자유게시판</span>
            </Link>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'login' ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <Link
              to={isLoggedIn ? '/mypage' : '/signin'}
              className="flex flex-col items-center justify-center gap-1"
            >
              <User className="w-5 h-5" />
              <span className="text-xs">{isLoggedIn ? '마이페이지' : '로그인'}</span>
            </Link>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Main;
