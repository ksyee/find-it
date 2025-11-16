import { useEffect, useState } from 'react';
import { supabase } from '@/lib/api/supabaseClient';
import {
  fetchProfileById,
  Profile as SupabaseProfile
} from '@/lib/api/profile';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import profile from '@/assets/profile.svg';
import { Bookmark, FileText, Mail, Search, Bell, Edit2 } from 'lucide-react';
import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';
import { logger } from '@/lib/utils/logger';

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget: () => void;
    };
  }
}

type AuthUserInfo = Pick<
  SupabaseProfile,
  'id' | 'nickname' | 'email' | 'avatar_url' | 'state' | 'city'
>;

// 서비스 준비 알럿
const showAlert = () => {
  alert('서비스 준비 중이에요, 조금만 기다려주세요! 😀');
};

const MyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<AuthUserInfo | null>(null);
  const [hasRecommendationAlert, setHasRecommendationAlert] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();
      const authUser = data.user;
      if (!authUser) return;

      try {
        const profileData = await fetchProfileById(authUser.id);
        if (profileData) {
          setUserInfo({
            id: profileData.id,
            nickname: profileData.nickname ?? '',
            email: profileData.email ?? authUser.email ?? '',
            avatar_url: profileData.avatar_url ?? null,
            state: profileData.state,
            city: profileData.city
          });
        } else {
          setUserInfo({
            id: authUser.id,
            nickname: authUser.email ?? '사용자',
            email: authUser.email ?? '',
            avatar_url: null,
            state: null,
            city: null
          });
        }
      } catch (error) {
        logger.error('프로필 정보를 불러오지 못했습니다.', error);
      }
    };

    void loadProfile();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/65eeb6d69131ed19d977bab0/1hom7kdu6';
    script.setAttribute('crossorigin', '*');

    document.body.appendChild(script);

    const hideTawkToWidget = () => {
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
    };

    const showTawkToWidget = () => {
      if (window.Tawk_API) {
        window.Tawk_API.showWidget();
      }
    };

    if (location.pathname !== '/mypageentry') {
      hideTawkToWidget();
    } else {
      showTawkToWidget();
    }

    return hideTawkToWidget;
  }, [location]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const saved = window.localStorage.getItem('recommendations');
      if (!saved || saved === '[]') {
        setHasRecommendationAlert(false);
      } else {
        setHasRecommendationAlert(true);
      }
    } catch (error) {
      logger.warn('Failed to read recommendations', error);
      setHasRecommendationAlert(false);
    }
  }, []);

  const handleLogout = () => {
    void (async () => {
      await supabase.auth.signOut();
      window.location.href = '/';
    })();
  };

  useHeaderConfig(
    () => ({
      isShowPrev: true,
      children: '마이페이지',
      empty: true
    }),
    []
  );

  const avatarSrc = userInfo?.avatar_url || profile;

  const actionButtons = [
    { label: '북마크 관리', icon: Bookmark, onClick: showAlert },
    { label: '게시글 관리', icon: FileText, onClick: showAlert },
    { label: '받은 쪽지함', icon: Mail, onClick: showAlert },
    { label: '검색 범위 설정', icon: Search, onClick: showAlert }
  ];

  if (!userInfo) {
    return (
      <div className="min-h-nav-safe flex items-center justify-center text-sm text-gray-500">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  const secondaryLinks = [
    { label: '공지사항', path: '/notice' },
    { label: '만든 사람들', path: '/credit' }
  ];

  return (
    <div className="min-h-nav-safe w-full bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-gray-100 bg-white md:h-32 md:w-32">
                <img
                  src={avatarSrc}
                  alt="나의 프로필 사진"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  {userInfo.nickname || '사용자'}
                </h2>
                <Link
                  to="/mypageedit"
                  className="rounded p-1 transition-colors hover:bg-gray-100"
                >
                  <Edit2 className="h-4 w-4 text-[#4F7EFF]" />
                </Link>
              </div>
              <p className="mb-4 text-sm text-[#666]">{userInfo.email || '-'}</p>
              <p className="text-xs text-gray-500">
                {userInfo.state && userInfo.city
                  ? `${userInfo.state} ${userInfo.city}`
                  : '등록된 지역 정보가 없습니다.'}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
          {actionButtons.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 text-left text-[#1a1a1a] transition-all hover:shadow-md md:p-6"
            >
              <Icon className="h-6 w-6 text-[#4F7EFF]" />
              <span>{label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigate('/notification')}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 text-left text-[#1a1a1a] transition-all hover:shadow-md md:col-span-2 md:p-6"
          >
            <div className="relative">
              <Bell className="h-6 w-6 text-[#4F7EFF]" />
              {hasRecommendationAlert && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </div>
            <span>키워드 알림</span>
          </button>
        </section>

        <section className="space-y-2 md:space-y-3">
          {secondaryLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className="w-full rounded-lg px-4 py-3 text-left text-[#666] transition-colors hover:bg-white/60"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-[#666] transition-colors hover:bg-white/60"
          >
            로그아웃
          </button>
        </section>
      </div>
    </div>
  );
};

export default MyPage;
