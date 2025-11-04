import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/widgets/navigation/ui/Navigation';
import Sidebar from '@/widgets/sidebar/ui/Sidebar';

const AppLayout = () => {
  const appUrl =
    (import.meta.env.VITE_APP_BASE_URL as string | undefined)?.trim() ||
    'https://find-it.vercel.app/';

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
      <Navigation />
      <div className="lg:flex lg:pt-[72px]">
        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 pb-[80px] lg:pb-0">
          <Outlet />
        </div>
        {/* 사이드바 (데스크탑만) */}
        <Sidebar />
      </div>
    </>
  );
};

export default AppLayout;
