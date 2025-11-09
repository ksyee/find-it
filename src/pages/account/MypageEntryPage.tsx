import { useEffect, useState } from 'react';
import MyPage from '@/pages/account/MyPagePage';
import SignIn from '@/pages/account/SignInPage';

const MypageEntry = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsLoggedIn(!!window.localStorage.getItem('pocketbase_auth'));
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  return isLoggedIn ? <MyPage /> : <SignIn />;
};

export default MypageEntry;
