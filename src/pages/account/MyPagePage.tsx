import { useEffect, useState } from 'react';
import { pb } from '@/lib/api/getPbData';
import { Link, useLocation } from 'react-router-dom';

import profile from '@/assets/profile.svg';
import icon_pencil from '@/assets/icons/icon_pencil.svg';
import icon_bookmark from '@/assets/icons/icon_bookmark.svg';
import icon_docs from '@/assets/icons/icon_docs.svg';
import icon_envelope from '@/assets/icons/icon_envelope.svg';
import icon_search from '@/assets/icons/icon_search_16.svg';
import icon_bell from '@/assets/icons/icon_bell.svg';
import Horizon from '@/shared/ui/layout/Horizon';
import getPbImgURL from '@/lib/utils/getPbImgURL';
import Header from '@/widgets/header/ui/Header';

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget: () => void;
    };
  }
}

interface AuthUserInfo {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
}

/* -------------------------------------------------------------------------- */
// 서비스 준비 알럿
const showAlert = () => {
  alert('서비스 준비 중이에요, 조금만 기다려주세요! 😀');
};
/* -------------------------------------------------------------------------- */
// 마이페이지 마크업
const Profile = ({ user }: { user: AuthUserInfo }) => {
  const avatarSrc =
    user.avatar && user.id ? getPbImgURL(user.id, user.avatar) : profile;

  return (
    <section className="my-[30px] flex items-center gap-4">
      <img
        src={avatarSrc}
        alt="나의 프로필 사진"
        className="size-66px rounded-full"
      />
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center gap-[4px]">
          <h1 className="text-xl">{user.nickname || '사용자'}</h1>
          <Link
            to="/mypageedit"
            className="p-1.5 transition-all duration-300 hover:rounded hover:bg-gray-100"
          >
            <img src={icon_pencil} alt="프로필 수정하기" />
          </Link>
        </div>
        <span className="text-xs text-gray-450">{user.email || '-'}</span>
      </div>
    </section>
  );
};

const List01 = () => {
  const [inboxAlert] = useState(false);

  return (
    <section className="pb-[26px]">
      <ul className="flex flex-col gap-[10px]">
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <button
            onClick={showAlert}
            className="flex items-center gap-[10px] py-[4px]"
          >
            <img src={icon_bookmark} alt="북마크 관리하기" />
            <span>북마크 관리</span>
          </button>
        </li>
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <button
            onClick={showAlert}
            className="flex items-center gap-[10px] py-[4px]"
          >
            <img src={icon_docs} alt="게시글 관리하기" />
            <span>게시글 관리</span>
          </button>
        </li>
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <button
            onClick={showAlert}
            className="flex items-center gap-[10px] py-[4px]"
          >
            <img src={icon_envelope} alt="받은 쪽지함 보기" />
            <span className="flex gap-[3px]">
              받은 쪽지함
              <p
                className={`${inboxAlert ? 'h-[7px] w-[7px] rounded-full bg-primary' : ''} `}
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
    if (typeof window === 'undefined') return;

    try {
      const savedRecommendations = window.localStorage.getItem('recommendations');
      if (!savedRecommendations) {
        setVoidAlarmIcon(false);
        return;
      }

      if (savedRecommendations === '[]') {
        setVoidAlarmIcon(false);
      } else {
        setVoidAlarmIcon(true);
      }
    } catch (error) {
      console.warn('Failed to read recommendations', error);
      setVoidAlarmIcon(false);
    }
  }, []);

  return (
    <section className="py-[26px]">
      <ul className="flex flex-col gap-[10px]">
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <button
            onClick={showAlert}
            className="flex items-center gap-[10px] py-[4px]"
          >
            <img src={icon_search} alt="검색 범위 설정하기" />
            <span>검색 범위 설정</span>
          </button>
        </li>
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <Link to="/notification" className="flex gap-[10px] py-[4px]">
            <img src={icon_bell} alt="키워드 알림 보기" />
            <span className="flex gap-[3px]">
              키워드 알림
              <p
                className={`${voidAlarmIcon ? 'h-[7px] w-[7px] rounded-full bg-primary' : ''} `}
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

const Menu = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <ul className="flex flex-col gap-[8px] py-[26px]">
      <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
        <Link to="/notice" className="flex items-center py-1">
          <span className="text-xs text-gray-500">공지사항</span>
        </Link>
      </li>
      <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
        <Link to="/credit" className="flex items-center py-1">
          <span className="text-xs text-gray-500">만든 사람들</span>
        </Link>
      </li>
      <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
        <button
          className="flex items-center py-1 text-xs text-gray-500"
          onClick={onLogout}
        >
          로그아웃
        </button>
      </li>
    </ul>
  );
};

const MyPage = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<AuthUserInfo | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const loginUserData = window.localStorage.getItem('pocketbase_auth');
      if (!loginUserData) return;

      const localData = JSON.parse(loginUserData);
      setUserInfo({
        id: localData?.model?.id ?? '',
        nickname: localData?.model?.nickname ?? '',
        email: localData?.model?.email ?? '',
        avatar: localData?.model?.avatar ?? ''
      });
    } catch (error) {
      console.warn('Failed to read auth data', error);
    }
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

  const handleLogout = () => {
    pb.authStore.clear();
    window.location.href = '/';
  };

  if (!userInfo) {
    return (
      <div className="flex min-h-nav-safe items-center justify-center text-sm text-gray-500">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-[375px] flex-col items-center">
      <Header isShowPrev={true} children="마이페이지" empty={true} />
      <div className="px-[30px]">
        <Profile user={userInfo} />
        <List01 />
        <Horizon lineBold="thin" lineWidth="short" />
        <List02 />
        <Horizon lineBold="thin" lineWidth="short" />
        <Menu onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default MyPage;
