import icon_prev from '@/assets/icons/icon_prev.svg';
import LOGO_SYMBOL from '@/assets/icons/LOGO_SYMBOL.svg';
import LOGOTYPE from '@/assets/icons/LOGOTYPE_true.svg';
import icon_search from '@/assets/icons/icon_search.svg';
import { useQueryClient } from '@tanstack/react-query';

import { ReactNode, Children } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export interface HeaderProps {
  isShowLogo?: boolean;
  isShowPrev?: boolean;
  isShowSymbol?: boolean;
  isShowSearch?: boolean;
  isShowSubmit?: boolean;
  empty?: boolean; // 헤더 영역에 2개 요소만 사용 시 빈자리에 해당 prop 전달 필요
  link?: string;
  customStyle?: string;
  children?: ReactNode;
  onSubmitClick?: () => void;
  submitLabel?: string;
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
  onSubmitClick,
  submitLabel
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

  const baseWrapperStyle =
    'mx-auto flex h-[26px] w-full items-center px-5 md:px-8 lg:max-w-[1280px]';

  const navigate = useNavigate();

  const handlePreviousPage = () => {
    navigate(-1);
    if (
      location.pathname === '/searchfindresult' ||
      location.pathname === '/searchlostresult'
    ) {
      queryClient.removeQueries({
        queryKey: ['searchFindResult'],
        exact: true
      });

      queryClient.removeQueries({
        queryKey: ['searchLostResult'],
        exact: true
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
    const isActive = Boolean(isShowSubmit);
    submitButton = (
      <button
        type="button"
        className={isActive ? 'text-primary' : 'text-gray-400'}
        disabled={!isActive}
        onClick={isActive ? onSubmitClick : undefined}
      >
        {submitLabel ?? '완료'}
      </button>
    );
  }

  if (children !== undefined) {
    paragraph = typeof children === 'string'
      ? <p className="text-[20px] font-semibold">{children}</p>
      : children;
  }

  if (empty !== undefined) {
    emptyBox = <span aria-hidden className="h-[21px] w-[21px]"></span>;
  }

  const shouldCenterSymbolOnly = !paragraph && !homeLogo && symbolLogo;
  const leftItems = Children.toArray(
    [prevIcon, shouldCenterSymbolOnly ? null : symbolLogo].filter(Boolean)
  );
  const centerContent = paragraph ?? homeLogo ?? (shouldCenterSymbolOnly ? symbolLogo : null);
  const rightItems = Children.toArray([searchIcon, submitButton, emptyBox].filter(Boolean));

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-white focus:px-4 focus:py-2"
      >
        메인 콘텐츠로 건너뛰기
      </a>
      <header
        className="fixed top-0 left-1/2 z-[9999] w-full -translate-x-1/2 transform bg-white py-[20px] md:hidden"
        role="banner"
      >
        <div className={`${baseWrapperStyle} ${customStyle || ''}`}>
          <div className="flex min-w-[48px] items-center gap-2">
            {leftItems.length > 0 ? leftItems : null}
          </div>
          <div className="flex flex-1 items-center justify-center text-center">
            {centerContent}
          </div>
          <div className="flex min-w-[48px] items-center justify-end gap-2">
            {rightItems.length > 0 ? rightItems : null}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
