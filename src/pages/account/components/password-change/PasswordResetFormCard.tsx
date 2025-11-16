import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthError } from '@supabase/supabase-js';
import ButtonVariable from '@/shared/ui/buttons/ButtonVariable';
import { supabase } from '@/lib/api/supabaseClient';
import { logger } from '@/lib/utils/logger';

type RecoveryStatus = 'checking' | 'ready' | 'success' | 'error';

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

const useRecoveryParams = (hash: string, search: string) => {
  return useMemo(() => {
    const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash || '');
    const queryParams = new URLSearchParams(search);

    const pick = (key: string) => hashParams.get(key) ?? queryParams.get(key);

    return {
      type: pick('type'),
      accessToken: pick('access_token'),
      refreshToken: pick('refresh_token'),
      tokenHash: pick('token_hash'),
      email: pick('email'),
      error: pick('error'),
      errorCode: pick('error_code'),
      errorDescription: pick('error_description')
    };
  }, [hash, search]);
};

const PasswordResetFormCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recoveryParams = useRecoveryParams(location.hash, location.search);

  const [status, setStatus] = useState<RecoveryStatus>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const restoreSessionFromUrl = async () => {
      if (recoveryParams.error) {
        setStatus('error');
        setErrorMessage(
          recoveryParams.errorDescription ||
            '비밀번호 재설정 링크가 만료되었거나 취소되었습니다. 다시 요청해주세요.'
        );
        return;
      }

      if (recoveryParams.type === 'recovery' && (recoveryParams.accessToken || recoveryParams.tokenHash)) {
        setStatus('checking');
        try {
          if (recoveryParams.accessToken && recoveryParams.refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: recoveryParams.accessToken,
              refresh_token: recoveryParams.refreshToken
            });
            if (error) throw error;
          } else if (recoveryParams.tokenHash && recoveryParams.email) {
            const params = {
              type: 'recovery',
              token_hash: recoveryParams.tokenHash,
              email: recoveryParams.email
            } as Parameters<typeof supabase.auth.verifyOtp>[0];
            const { error } = await supabase.auth.verifyOtp(params);
            if (error) throw error;
          } else {
            throw new Error('복구 토큰 정보가 충분하지 않습니다.');
          }

          if (typeof window !== 'undefined') {
            const cleanUrl = window.location.pathname + window.location.search;
            window.history.replaceState({}, document.title, cleanUrl);
          }

          setStatus('ready');
          setErrorMessage('');
          return;
        } catch (error) {
          logger.error('비밀번호 복구 세션 생성 실패', error);
          setStatus('error');
          setErrorMessage('링크가 만료되었거나 이미 사용되었습니다. 다시 요청해주세요.');
          return;
        }
      }

      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setStatus('ready');
        setErrorMessage('');
        return;
      }

      setStatus('error');
      setErrorMessage('비밀번호 재설정 링크를 통해 다시 접근하거나 로그인 상태에서 시도해주세요.');
    };

    void restoreSessionFromUrl();
  }, [recoveryParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!passwordRegex.test(password)) {
      setFormError('영어, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setFormError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw error;
      }
      setStatus('success');
      setPassword('');
      setPasswordConfirm('');
    } catch (error) {
      logger.error('비밀번호 재설정 실패', error);
      if (error instanceof AuthError) {
        setFormError(error.message);
      } else {
        setFormError('비밀번호를 변경하지 못했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <section className="rounded-3xl bg-white p-6 text-center shadow-sm md:p-8">
        <p className="text-sm text-[#4F7EFF]">비밀번호가 변경되었어요!</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#1a1a1a]">다시 로그인을 진행해 주세요.</h2>
        <p className="mt-3 text-sm text-[#666]">
          새로운 비밀번호로 바로 로그인하거나 홈으로 돌아갈 수 있어요.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <ButtonVariable
            buttonText="로그인 하기"
            variant="submit"
            type="button"
            onClick={() => navigate('/signin')}
          />
          <ButtonVariable
            buttonText="메인으로 돌아가기"
            variant="lineStyle"
            type="button"
            onClick={() => navigate('/')}
          />
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-xl font-semibold text-[#1a1a1a]">비밀번호 재설정을 진행할 수 없어요</h2>
        <p className="mt-3 text-sm text-[#666]">{errorMessage}</p>
        <div className="mt-6 flex flex-col gap-3">
          <ButtonVariable
            buttonText="로그인 화면으로"
            variant="lineStyle"
            type="button"
            onClick={() => navigate('/signin')}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm text-[#666]">Password</p>
        <h2 className="text-2xl font-semibold text-[#1a1a1a]">비밀번호 재설정</h2>
        <p className="text-sm text-[#999]">
          {status === 'checking'
            ? '링크 정보를 확인하고 있어요. 잠시만 기다려주세요.'
            : '새로운 비밀번호를 입력하고 확인을 눌러주세요.'}
        </p>
      </div>

      {status === 'checking' ? (
        <p className="text-sm text-[#4F7EFF]">인증 링크를 검증하는 중입니다...</p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-[#1a1a1a]" htmlFor="new-password">
              새 비밀번호
            </label>
            <input
              id="new-password"
              type="password"
              className="mt-2 w-full rounded-2xl border border-gray-200 p-4 text-sm focus:border-[#4F7EFF] focus:outline-none"
              placeholder="영어, 숫자, 특수문자를 포함한 8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1a1a1a]" htmlFor="confirm-password">
              새 비밀번호 확인
            </label>
            <input
              id="confirm-password"
              type="password"
              className="mt-2 w-full rounded-2xl border border-gray-200 p-4 text-sm focus:border-[#4F7EFF] focus:outline-none"
              placeholder="다시 한 번 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <ButtonVariable
            buttonText={isSubmitting ? '처리 중...' : '비밀번호 변경하기'}
            variant={isSubmitting ? 'disabled' : 'submit'}
          />
        </form>
      )}
    </section>
  );
};

export default PasswordResetFormCard;
