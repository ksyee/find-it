import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/widgets/navigation/ui/Navigation';

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
      <div className="pb-[80px] lg:pb-0 lg:pt-[72px]">
        <Outlet />
      </div>
      <Navigation />
    </>
  );
};

export default AppLayout;
