import { Route, Routes } from 'react-router-dom';
import AppLayout from '@/app/layouts/AppLayout';
import {
  Main,
  MyPage,
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
  SearchFindDetail,
  SearchLostDetail,
  SearchFindResult,
  SearchLostResult
} from '@/pages';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
