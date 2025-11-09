import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Package,
  MessageSquare,
  User
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.body.classList.add('has-navigation');
    return () => {
      document.body.classList.remove('has-navigation');
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsLoggedIn(!!window.localStorage.getItem('pocketbase_auth'));
  }, []);

  // 현재 경로에 따라 active 상태 결정
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isMyPageActive = () => {
    return location.pathname.startsWith('/mypage') ||
           location.pathname.startsWith('/signin') ||
           location.pathname.startsWith('/signup');
  };

  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 hidden border-b border-gray-200 bg-white md:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/">
                <h2 className="text-[#4F7EFF]">찾아줘!</h2>
              </Link>
              <div className="flex gap-6">
                <Link
                  to="/"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    isActive('/')
                      ? 'bg-[#4F7EFF]/10 text-[#4F7EFF]'
                      : 'text-[#666] hover:text-[#4F7EFF]'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>홈</span>
                </Link>
                <Link
                  to="/getlist"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    isActive('/getlist') || isActive('/searchfind')
                      ? 'bg-[#4F7EFF]/10 text-[#4F7EFF]'
                      : 'text-[#666] hover:text-[#4F7EFF]'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>습득물</span>
                </Link>
                <Link
                  to="/lostlist"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    isActive('/lostlist') || isActive('/searchlost')
                      ? 'bg-[#4F7EFF]/10 text-[#4F7EFF]'
                      : 'text-[#666] hover:text-[#4F7EFF]'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>분실물</span>
                </Link>
                <Link
                  to="/postlist"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    isActive('/postlist') || isActive('/searchpost') || isActive('/createpost') || isActive('/postdetail')
                      ? 'bg-[#4F7EFF]/10 text-[#4F7EFF]'
                      : 'text-[#666] hover:text-[#4F7EFF]'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>자유게시판</span>
                </Link>
              </div>
            </div>
            <Link
              to={isLoggedIn ? '/mypage' : '/signin'}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                isMyPageActive()
                  ? 'bg-[#4F7EFF] text-white'
                  : 'border border-[#4F7EFF] text-[#4F7EFF] hover:bg-[#4F7EFF]/10'
              }`}
            >
              <User className="h-4 w-4" />
              <span>{isLoggedIn ? '마이페이지' : '로그인'}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white md:hidden">
        <div className="grid h-16 grid-cols-5">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive('/') ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">홈</span>
          </Link>
          <Link
            to="/getlist"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive('/getlist') || isActive('/searchfind') ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">습득물</span>
          </Link>
          <Link
            to="/lostlist"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive('/lostlist') || isActive('/searchlost') ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs">분실물</span>
          </Link>
          <Link
            to="/postlist"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive('/postlist') || isActive('/searchpost') || isActive('/createpost') || isActive('/postdetail') ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">자유게시판</span>
          </Link>
          <Link
            to={isLoggedIn ? '/mypage' : '/signin'}
            className={`flex flex-col items-center justify-center gap-1 ${
              isMyPageActive() ? 'text-[#4F7EFF]' : 'text-[#999]'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">
              {isLoggedIn ? '마이페이지' : '로그인'}
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
