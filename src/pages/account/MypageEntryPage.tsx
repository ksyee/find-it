import { useEffect, useState } from 'react';
import MyPage from '@/pages/account/MyPagePage';
import SignIn from '@/pages/account/SignInPage';
import { supabase } from '@/lib/api/supabaseClient';

const MypageEntry = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      setChecked(true);
    };

    void fetchSession();
  }, []);

  if (!checked) {
    return null;
  }

  return isLoggedIn ? <MyPage /> : <SignIn />;
};

export default MypageEntry;
