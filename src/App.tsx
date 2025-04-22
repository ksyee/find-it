import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import {
  Main,
  MyPage,
  Splash,
  SignIn,
  SignUp,
  Credit,
  Notice,
  Welcome,
  GetList,
  GetDetail,
  LostDetail,
  LostList,
  NotFound,
  MypageEdit,
  MypageEntry,
  MypageDelete,
  Notification,
  PostList,
  PostDetail,
  SearchPost,
  CreatePost,
} from '@/components/pages/index';
import SearchFindDetail from '@/components/SearchDetail/pages/SearchFindDetail';
import SearchLostDetail from './components/SearchDetail/pages/SearchLostDetail';
import SearchFindResult from '@/components/SearchResult/SearchFindResult';
import SearchLostResult from './components/SearchResult/SearchLostResult';
// import { SyncScheduler } from './lib/utils/scheduledSync';
// import { setupSupabase } from './lib/utils/setupSupabase';

const SPLASH_KEY = 'alreadyVisited';

const queryClient = new QueryClient();

const App = (): JSX.Element => {
  const [showSplash, setShowSplash] = useState(() => {
    // 로컬 스토리지에서 키 값을 읽기
    const alreadyVisited = JSON.parse(localStorage.getItem(SPLASH_KEY));
    // 이미 방문한 적이 있다면?
    // 스플래시 이미지를 감춘다.
    return alreadyVisited ? false : true;
  });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (showSplash) {
      // 스플래시 보이는 시간 :  3.5초 뒤 사라짐
      timeout = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem(SPLASH_KEY, JSON.stringify(true));
      }, 3500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showSplash]);

  // Supabase 초기화 및 동기화 스케줄러 설정 비활성화
  /* 
  useEffect(() => {
    const initSyncScheduler = async () => {
      try {
        // Supabase 테이블 초기 설정
        await setupSupabase();

        // 동기화 스케줄러 시작
        const scheduler = SyncScheduler.getInstance();
        scheduler.start();

        // 앱 종료 시 스케줄러 중지 (정리 함수)
        return () => {
          scheduler.stop();
        };
      } catch (error) {
        console.error('동기화 스케줄러 초기화 오류:', error);
      }
    };

    initSyncScheduler();
  }, []);
  */

  if (showSplash) {
    return <Splash />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HelmetProvider>
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
            <meta property="og:url" content="https://findmyitem.netlify.app/" />
          </Helmet>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/getlist" element={<GetList />} />
            <Route path="/getlist/detail/:id" element={<GetDetail />} />
            <Route path="/lostlist" element={<LostList />} />
            <Route path="/lostlist/detail/:id" element={<LostDetail />} />
            <Route path="/searchfind" element={<SearchFindDetail />} />
            <Route path="/searchfindresult" element={<SearchFindResult />} />
            <Route path="/searchlost" element={<SearchLostDetail />} />
            <Route path="/searchlostresult" element={<SearchLostResult />} />
            <Route path="/mypageentry" element={<MypageEntry />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypageedit" element={<MypageEdit />} />
            <Route path="/mypagedelete" element={<MypageDelete />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/credit" element={<Credit />} />
            <Route path="/postlist" element={<PostList />} />
            <Route path="/postdetail/:id" element={<PostDetail />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/searchpost" element={<SearchPost />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
