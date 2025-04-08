import { useEffect, useState } from 'react';
import { signOut } from '@/lib/utils/auth';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/api/supabase';

import profile from '@/assets/profile.svg';
import icon_pencil from '@/assets/icons/icon_pencil.svg';
import icon_bookmark from '@/assets/icons/icon_bookmark.svg';
import icon_docs from '@/assets/icons/icon_docs.svg';
import icon_envelope from '@/assets/icons/icon_envelope.svg';
import icon_search from '@/assets/icons/icon_search_16.svg';
import icon_bell from '@/assets/icons/icon_bell.svg';
import Horizon from '../../common/atom/Horizon';
import getImageURL from '@/lib/utils/getImageURL';
import Header from '../../Header/Header';

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget: () => void;
    };
  }
}

/* -------------------------------------------------------------------------- */
// 로그인 유저 정보 가져오기
const loginUserData = localStorage.getItem('supabase_auth');
const localData = loginUserData && JSON.parse(loginUserData);
const userNickname = localData?.user?.user_metadata?.nickname;
const userEmail = localData?.session?.user?.email;
const userId = localData?.session?.user?.id;

// 프로필 이미지 URL 처리 함수
const getProfileImageSrc = (avatarValue: string | null | undefined): string => {
  console.log('프로필 이미지 값:', avatarValue);

  if (!avatarValue) {
    console.log('기본 이미지 사용');
    return profile;
  }

  // URL인지 확인 (http 또는 https로 시작하는지)
  if (avatarValue.startsWith('http')) {
    console.log('전체 URL 사용:', avatarValue);
    return avatarValue;
  }

  // 파일명만 있는 경우 getImageURL 사용
  const imageUrl = getImageURL('avatars', avatarValue);
  console.log('생성된 URL:', imageUrl);
  return imageUrl;
};

// 이미지 로드 오류 처리
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  console.error('이미지 로드 실패:', e.currentTarget.src);
  e.currentTarget.src = profile; // 기본 프로필 이미지로 대체
};

// 로그아웃 기능
const handleLogout = async () => {
  await signOut();
  localStorage.removeItem('supabase_auth');
  window.location.href = '/';
};

/* -------------------------------------------------------------------------- */
// 서비스 준비 알럿
const showAlert = () => {
  alert('서비스 준비 중이에요, 조금만 기다려주세요! 😀');
};
/* -------------------------------------------------------------------------- */
// 마이페이지 마크업
const Profile = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // 캐시된 URL이 있는지 확인
    const cachedUrl = sessionStorage.getItem('user_avatar_url');

    if (cachedUrl) {
      // 캐시된 URL 사용
      console.log('캐시된 프로필 이미지 URL 사용:', cachedUrl);
      setAvatarUrl(cachedUrl);
    } else {
      // 없으면 데이터베이스에서 가져오기
      const fetchAvatarUrl = async () => {
        if (!userId) return;

        try {
          // users 테이블에서 사용자의 avatar URL 조회
          const { data, error } = await supabase
            .from('users')
            .select('avatar')
            .eq('id', userId)
            .single();

          if (error) {
            console.error('프로필 이미지 URL 조회 오류:', error);
            return;
          }

          if (data && data.avatar) {
            console.log('데이터베이스에서 가져온 avatar URL:', data.avatar);
            setAvatarUrl(data.avatar);
            // 세션 스토리지에 URL 캐싱
            sessionStorage.setItem('user_avatar_url', data.avatar);
          }
        } catch (error) {
          console.error('프로필 이미지 조회 중 오류 발생:', error);
        }
      };

      fetchAvatarUrl();
    }
  }, []);

  return (
    <section className="my-30px flex items-center gap-4">
      <img
        src={avatarUrl ? getProfileImageSrc(avatarUrl) : profile}
        alt="나의 프로필 사진"
        className="size-66px rounded-full object-cover"
        onError={handleImageError}
      />
      <div className="flex flex-col gap-6px">
        <div className="flex items-center gap-4px">
          <h1 className="text-20px">{userNickname}</h1>
          <Link
            to="/mypageedit"
            className="p-1.5 transition-all duration-300 hover:rounded hover:bg-gray-100"
          >
            <img src={icon_pencil} alt="프로필 수정하기" />
          </Link>
        </div>
        <span className="text-12px text-gray-450">{userEmail}</span>
      </div>
    </section>
  );
};

const List01 = () => {
  const [inboxAlert] = useState(false);

  return (
    <section className="pb-26px">
      <ul className="flex flex-col gap-10px">
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <button
            onClick={showAlert}
            className="flex items-center gap-10px py-4px"
          >
            <img src={icon_bookmark} alt="북마크 관리하기" />
            <span>북마크 관리</span>
          </button>
        </li>
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <button
            onClick={showAlert}
            className="flex items-center gap-10px py-4px"
          >
            <img src={icon_docs} alt="게시글 관리하기" />
            <span>게시글 관리</span>
          </button>
        </li>
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <button
            onClick={showAlert}
            className="flex items-center gap-10px py-4px"
          >
            <img src={icon_envelope} alt="받은 쪽지함 보기" />
            <span className="flex gap-3px">
              받은 쪽지함
              <p
                className={`${inboxAlert ? 'h-7px w-7px rounded-full bg-primary' : ''} `}
              >
                &nbsp;
              </p>
            </span>
          </button>
        </li>
      </ul>
    </section>
  );
};

const List02 = () => {
  const [voidAlarmIcon, setVoidAlarmIcon] = useState(false);

  useEffect(() => {
    const savedRecommendations = localStorage.getItem('recommendations');

    if (savedRecommendations === '[]') {
      setVoidAlarmIcon(false);
    } else {
      setVoidAlarmIcon(true);
    }
  }, []);

  return (
    <section className="py-26px">
      <ul className="flex flex-col gap-10px">
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <button
            onClick={showAlert}
            className="flex items-center gap-10px py-4px"
          >
            <img src={icon_search} alt="검색 범위 설정하기" />
            <span>검색 범위 설정</span>
          </button>
        </li>
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <Link to="/notification" className="flex gap-10px py-4px">
            <img src={icon_bell} alt="키워드 알림 보기" />
            <span className="flex gap-3px">
              키워드 알림
              <p
                className={`${voidAlarmIcon ? 'h-7px w-7px rounded-full bg-primary' : ''} `}
              >
                &nbsp;
              </p>
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

const Menu = () => {
  return (
    <ul className="flex flex-col gap-8px py-26px">
      <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
        <Link to="/notice" className="flex items-center py-1">
          <span className="text-12px text-gray-500">공지사항</span>
        </Link>
      </li>
      <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
        <Link to="/credit" className="flex items-center py-1">
          <span className="text-12px text-gray-500">만든 사람들</span>
        </Link>
      </li>
      <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
        <button
          className="flex items-center py-1 text-12px text-gray-500"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </li>
    </ul>
  );
};

const MyPage = () => {
  const location = useLocation();
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

  return (
    <div className="flex w-full min-w-375px flex-col items-center">
      <Header isShowPrev={true} children="마이페이지" empty={true} />
      <div className="px-30px">
        <Profile />
        <List01 />
        <Horizon lineBold="thin" lineWidth="short" />
        <List02 />
        <Horizon lineBold="thin" lineWidth="short" />
        <Menu />
      </div>
    </div>
  );
};

export default MyPage;
