import { useEffect, useRef, useState } from 'react';
import { AuthError, type User } from '@supabase/supabase-js';
import { supabase } from '@/lib/api/supabaseClient';
import { fetchProfileById, upsertProfile } from '@/lib/api/profile';
import InputForm from '@/features/auth/sign-in/ui/InputForm';
import ButtonVariable from '@/shared/ui/buttons/ButtonVariable';
import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';
import { logger } from '@/lib/utils/logger';

//알럿창 타입 정의
type AlertProps =
  | 'doubleCheckEmail'
  | 'doubleCheckNickname'
  | 'doubleCheckPassword'
  | 'invalidValue'
  | 'invalidEmail'
  | 'invalidPassword'
  | 'userEmail'
  | 'userEmailDouble'
  | '';

const SignIn = () => {
  // 변수
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordType, setPasswordType] = useState('password');

  const [alertEmail, setAlertEmail] = useState<AlertProps>();
  const [alertPassword, setAlertPassword] = useState<AlertProps>();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // 입력 함수
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = e.target.value;
    setEmailValue(newValue);
    setAlertEmail('');
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPasswordValue(newValue);
    setAlertPassword('');
  };

  // 비밀번호 눈 보이기
  const handleEyePassword = () => {
    setPasswordType((current) =>
      current === 'password' ? 'text' : 'password'
    );
  };

  // 삭제 버튼
  const handleDeleteEmail = () => {
    setEmailValue('');
    setAlertEmail('');
  };
  const handleDeletePassword = () => {
    setPasswordValue('');
    setAlertPassword('');
  };
  // 회원가입 버튼
  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = '/signup';
  };

  // 로그인 버튼 활성화 조건 : 빈문자열만 아니면 됨
  const [variant, setVariant] = useState<'submit' | 'disabled'>('disabled');
  useEffect(() => {
    if (emailValue.trim() !== '' && passwordValue !== '') {
      setVariant('submit');
    } else {
      setVariant('disabled');
    }
  }, [emailValue, passwordValue]);

  // 최종 로그인 버튼
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertEmail('');
    setAlertPassword('');

    const ensureProfileExists = async (authUser: User | null) => {
      if (!authUser) {
        return;
      }

      try {
        const existingProfile = await fetchProfileById(authUser.id);
        if (existingProfile) {
          return;
        }

        await upsertProfile(authUser.id, {
          email: authUser.email,
          nickname:
            typeof authUser.user_metadata?.nickname === 'string'
              ? authUser.user_metadata.nickname
              : authUser.email?.split('@')[0] ?? '',
          state:
            typeof authUser.user_metadata?.state === 'string'
              ? authUser.user_metadata.state
              : null,
          city:
            typeof authUser.user_metadata?.city === 'string'
              ? authUser.user_metadata.city
              : null,
          keywords: ''
        });
      } catch (profileError) {
        // 최초 로그인 시점에만 일시적으로 실패할 수 있으므로 사용자 흐름을 막지 않는다.
        logger.warn('로그인 중 프로필 동기화 실패:', profileError);
      }
    };

    const normalizedEmail = emailValue.trim();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: passwordValue
      });

      if (error) {
        throw error;
      }

      await ensureProfileExists(data.user);

      window.location.href = '/';
    } catch (error) {
      if (error instanceof AuthError) {
        const message = error.message.toLowerCase();
        if (message.includes('invalid login credentials')) {
          setAlertPassword('invalidValue');
          return;
        }
        if (message.includes('email')) {
          setAlertEmail('userEmail');
          return;
        }

        setAlertPassword('invalidValue');
      } else {
        setAlertPassword('invalidValue');
      }
    }
  };
  // 마크업
  useHeaderConfig(
    () => ({
      children: '로그인',
      empty: true,
      isShowPrev: true
    }),
    []
  );

  return (
    <div className="min-h-nav-safe flex w-full flex-col items-center bg-white md:mt-5">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full justify-center">
          <form className="w-full max-w-[430px] px-5 pb-10" onSubmit={handleSignIn}>
            <div className="flex flex-col gap-5">
              <InputForm
                ref={emailRef}
                type="email"
                title="useremail"
                placeholder="이메일"
                value={emailValue}
                onChange={handleEmail}
                iconDelete={!!emailValue}
                onClickDelete={handleDeleteEmail}
                alertCase={alertEmail}
              />
              <InputForm
                ref={passwordRef}
                type={passwordType}
                title="userpassword"
                placeholder="비밀번호(영어, 숫자, 특수문자 조합)"
                value={passwordValue}
                onChange={handlePassword}
                iconDelete={!!passwordValue}
                iconEyeToggle={true}
                onClickDelete={handleDeletePassword}
                onClickEye={handleEyePassword}
                alertCase={alertPassword}
              />
            </div>
            <div className="box-border flex flex-col items-center gap-4 pt-20">
              <ButtonVariable buttonText="로그인" variant={variant} />
              <ButtonVariable
                buttonText="회원가입"
                variant="lineStyle"
                onClick={handleSignUp}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
