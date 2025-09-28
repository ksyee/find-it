import MyPage from '@/pages/account/MyPagePage';
import SignIn from '@/pages/account/SignInPage';

const MypageEntry = () => {
  const loginUserData = localStorage.getItem('pocketbase_auth');

  return (
    <>
      {loginUserData && <MyPage />}
      {!loginUserData && <SignIn />}
    </>
  );
};

export default MypageEntry;
