import icon_prev from '@/assets/icons/icon_prev.svg';
import LOGO_SYMBOL from '@/assets/icons/LOGO_SYMBOL.svg';
import LOGOTYPE from '@/assets/icons/LOGOTYPE_true.svg';
import icon_search from '@/assets/icons/icon_search.svg';
import { useQueryClient } from '@tanstack/react-query';

import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  isShowLogo?: boolean;
  isShowPrev?: boolean;
  isShowSymbol?: boolean;
  isShowSearch?: boolean;
  isShowSubmit?: boolean;
  empty?: boolean; // 헤더 영역에 2개 요소만 사용 시 빈자리에 해당 prop 전달 필요
  link?: string;
  customStyle?: string;
  children?: string;
}

type ElementType =
  | string
  | number
  | boolean
  | JSX.Element
  | Iterable<ReactNode>
  | null
  | undefined;

const Header = ({
  isShowLogo,
  isShowPrev,
  isShowSymbol,
  isShowSearch,
  isShowSubmit,
  empty,
  link,
  customStyle,
  children,
}: HeaderProps) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  let homeLogo: ElementType = null;
  let symbolLogo: ElementType = null;
  let prevIcon: ElementType = null;
  let searchIcon: ElementType = null;
  let paragraph: ElementType = null;
  let submitButton: ElementType = null;
  let emptyBox: ElementType = null;

  const defaultStyle =
    'mx-auto flex h-[26px] w-full lg:max-w-[1280px] items-center justify-around px-5 md:px-8';

  const navigate = useNavigate();

  const handlePreviousPage = () => {
    navigate(-1);
    if (
      location.pathname === '/searchfindresult' ||
      location.pathname === '/searchlostresult'
    ) {
      queryClient.removeQueries({
        queryKey: ['searchFindResult'],
        exact: true,
      });

      queryClient.removeQueries({
        queryKey: ['searchLostResult'],
        exact: true,
      });
    }
  };

  if (isShowLogo !== undefined) {
    if (isShowLogo) {
      homeLogo = (
        <Link to="/">
          <h1 aria-label="메인 페이지로 이동">
            <img src={LOGOTYPE} alt="찾아줘 로고 풀버전" />
          </h1>
        </Link>
      );
    } else {
      homeLogo = null;
    }
  }

  if (isShowSymbol !== undefined) {
    if (isShowSymbol) {
      symbolLogo = (
        <Link to="/">
          <h1 aria-label="메인 페이지로 이동">
            <img src={LOGO_SYMBOL} alt="찾아줘 로고 약식버전" />
          </h1>
        </Link>
      );
    } else {
      symbolLogo = null;
    }
  }

  if (isShowPrev !== undefined) {
    if (isShowPrev) {
      prevIcon = (
        <button onClick={handlePreviousPage}>
          <img src={icon_prev} alt="이전으로" />
        </button>
      );
    } else {
      prevIcon = null;
    }
  }

  if (isShowSearch !== undefined) {
    if (isShowSearch && link) {
      searchIcon = (
        <Link to={link}>
          <img src={icon_search} alt="검색하기" />
        </Link>
      );
    } else {
      searchIcon = null;
    }
  }

  if (isShowSubmit !== undefined) {
    if (isShowSubmit) {
      submitButton = (
        <button type="submit" className="text-primary">
          완료
        </button>
      );
    } else {
      submitButton = (
        <button type="submit" disabled className="text-gray-400">
          완료
        </button>
      );
    }
  }

  if (children !== undefined) {
    paragraph = <p className="text-[20px]">{children}</p>;
  }

  if (empty !== undefined) {
    emptyBox = <span className="h-[21px] w-[21px]"></span>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-white focus:px-4 focus:py-2"
      >
        메인 콘텐츠로 건너뛰기
      </a>
      <header
        className="fixed left-1/2 top-0 z-[9999] w-full lg:max-w-[1280px] -translate-x-1/2 transform bg-white py-[20px]"
        role="banner"
      >
        <div className={`${defaultStyle} ${customStyle || ''}`}>
          {prevIcon}
          {symbolLogo}
          {paragraph}
          {homeLogo}
          {searchIcon}
          {submitButton}
          {emptyBox}
        </div>
      </header>
      <div aria-hidden className="mx-auto h-[66px] w-full lg:max-w-[1280px]" />
    </>
  );
};

export default Header;
