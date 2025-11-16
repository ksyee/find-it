import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/widgets/navigation/ui/Navigation';
import Header from '@/widgets/header/ui/Header';
import {
  HeaderConfigProvider,
  useHeaderState
} from '@/widgets/header/model/HeaderConfigContext';

const AppLayoutInner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appUrl =
    (import.meta.env.VITE_APP_BASE_URL as string | undefined)?.trim() ||
    'https://find-it.vercel.app/';
  const headerConfig = useHeaderState();
  const { visible, ...headerProps } = headerConfig;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hash = window.location.hash;
    if (!hash || hash.length <= 1) {
      return;
    }

    const normalized = hash.startsWith('#') ? hash.slice(1) : hash;
    const shouldRedirect = /type=recovery/.test(normalized) || /error=/.test(normalized);
    if (!shouldRedirect) {
      return;
    }

    const search = `?${normalized}`;
    if (location.pathname === '/reset-password' && location.search !== search) {
      navigate(`/reset-password${search}`, { replace: true });
      return;
    }

    if (location.pathname !== '/reset-password') {
      navigate(`/reset-password${search}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const { body } = document;
    if (visible) {
      body.classList.add('has-mobile-header');
    } else {
      body.classList.remove('has-mobile-header');
    }

    return () => {
      body.classList.remove('has-mobile-header');
    };
  }, [visible]);

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="분실물 습득물 찾기 서비스 찾아줘!"
        />
        <meta
          name="keywords"
          content="찾아줘!, 분실물, 습득물, 잃어버린 물건, react, swiper, html, css, javascript, 공공 api"
        />
        <meta name="author" content="세븐일레븐" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="찾아줘!" />
        <meta property="og:site_name" content="find-it" />
        <meta
          property="og:description"
          content="분실물 습득물 찾기 서비스 찾아줘!"
        />
        <meta property="og:image" content="./img_og.jpg" />
        <meta
          property="og:url"
          content={appUrl}
        />
      </Helmet>

      {visible && <Header {...headerProps} />}

      <Navigation />

      <div className="w-full min-h-nav-safe pt-nav-safe pb-nav-safe">
        <Outlet />
      </div>
    </>
  );
};

const AppLayout = () => {
  return (
    <HeaderConfigProvider>
      <AppLayoutInner />
    </HeaderConfigProvider>
  );
};

export default AppLayout;
