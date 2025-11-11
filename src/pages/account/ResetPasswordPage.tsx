import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PasswordResetFormCard from '@/pages/account/components/password-change/PasswordResetFormCard';
import { supabase } from '@/lib/api/supabaseClient';
import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const recoveryContext = useMemo(() => {
    const hash = location.hash?.startsWith('#') ? location.hash.slice(1) : location.hash ?? '';
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(location.search);
    const pick = (key: string) => hashParams.get(key) ?? queryParams.get(key);

    return {
      type: pick('type'),
      accessToken: pick('access_token'),
      refreshToken: pick('refresh_token'),
      tokenHash: pick('token_hash'),
      error: pick('error')
    };
  }, [location.hash, location.search]);

  const hasRecoveryToken = Boolean(
    recoveryContext.type === 'recovery' && (recoveryContext.accessToken || recoveryContext.tokenHash)
  );
  const hasRecoveryError = Boolean(recoveryContext.error);
  const canRenderForm = hasRecoveryToken || hasRecoveryError;

  useEffect(() => {
    if (canRenderForm) {
      return;
    }

    let isMounted = true;
    const redirectBySession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (data.session) {
        navigate('/', { replace: true });
      } else {
        navigate('/signin', { replace: true });
      }
    };

    void redirectBySession();

    return () => {
      isMounted = false;
    };
  }, [canRenderForm, navigate]);

  useHeaderConfig(
    () => ({
      isShowPrev: true,
      children: '비밀번호 재설정',
      empty: true
    }),
    []
  );

  if (!canRenderForm) {
    return null;
  }

  return (
    <div className="flex min-h-nav-safe w-full flex-col items-center bg-[#f8f8f8]">
      <main
        id="main-content"
        className="flex w-full flex-1 items-start justify-center px-4 pt-16 pb-24 md:pt-[18vh]"
      >
        <div className="w-full max-w-md">
          <PasswordResetFormCard />
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
