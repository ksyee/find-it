import { pb } from '@/lib/api/getPbData';
import { useEffect, useRef, useState } from 'react';
import Header from '@/widgets/header/ui/Header';
import InputFormSlim from '@/features/auth/sign-in/ui/InputFormSlim';
import ButtonVariable from '@/shared/ui/buttons/ButtonVariable';
import ModalComp from '@/shared/ui/modal/ModalComp';

// 타입 정의
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

const MypageDelete = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const loginUserData = window.localStorage.getItem('pocketbase_auth');
      if (!loginUserData) return;

      const localData = JSON.parse(loginUserData);
      setUserEmail(localData?.model?.email ?? '');
      setUserId(localData?.model?.id ?? '');
    } catch (error) {
      console.warn('Failed to read auth data', error);
    }
  }, []);

  // 이메일 변수
  const [emailValue, setEmailValue] = useState('');
  const [emailCheckValue, setEmailCheckValue] = useState('');
  const [alertEmail, setAlertEmail] = useState<AlertProps>();

  const emailRef = useRef(null);
  const emailCheckRef = useRef(null);

  // 이메일1 입력값
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = e.target.value;
    setEmailValue(newValue);
    setAlertEmail('');
  };
  // 이메일2 입력갑 확인 & 1과 비교
  const handleEmailCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = e.target.value;
    setEmailCheckValue(newValue);
  };

  // 이메일 삭제 버튼
  const handleDeleteEmail = () => {
    setEmailValue('');
    setAlertEmail('');
  };
  const handleDeleteEmailCheck = () => {
    setEmailCheckValue('');
  };
  /* -------------------------------------------------------------------------- */
  // 최종 버튼 활성화 조건 = 입력값 동일시 & 버튼 변경
  const [variant, setVariant] = useState<'submit' | 'disabled'>('disabled');
  useEffect(() => {
    if (
      emailValue !== '' &&
      emailCheckValue !== '' &&
      emailCheckValue === emailValue
    ) {
      setVariant('submit');
    } else {
      setVariant('disabled');
    }
  }, [emailValue, emailCheckValue]);

  // 최종 버튼 && 유저 이메일 비교
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteData = async () => {
    if (!userId) return;
    try {
      await pb.collection('users').delete(userId);
    } catch (error) {
      console.error('pb 유저 데이터 삭제 오류', error);
    }
  };

  const isComplete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailValue !== userEmail) {
      setAlertEmail('userEmailDouble');
    } else {
      setAlertEmail('');
      deleteData();
      setIsModalOpen(true);
    }
  };
  const onClickConfirm = () => {
    pb.authStore.clear();
    window.location.href = '/';
    setIsModalOpen(false);
  };

  /* -------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="mx-auto my-0 flex w-[375px] flex-col">
      <Header isShowPrev={true} children={''} empty={true} />
      <form className="stext-left mx-[30px] mt-[20px]" onSubmit={isComplete}>
        <h1 className="leading-7.5 text-xl">
          회원 확인을 위해
          <br />
          이메일을 입력해주세요.
        </h1>
        <span className="inline-block w-[244px] pt-[12px] text-left text-sm text-gray-400">
          회원 탈퇴 처리 후 복구가 불가합니다.
        </span>
        <li className="mt-[40px] flex items-baseline justify-between">
          <h2 className="text-xs">이메일 입력</h2>
          <div className="w-[232px]">
            <InputFormSlim
              ref={emailRef}
              type="email"
              title="useremail"
              placeholder="이메일을 입력해주세요."
              value={emailValue}
              onChange={handleEmail}
              iconDelete={!!emailValue}
              onClickDelete={handleDeleteEmail}
              alertCase={alertEmail}
            />
          </div>
        </li>
        <li className="mt-[16px] flex items-baseline justify-between ">
          <h2 className="text-xs">이메일 확인</h2>
          <div className="w-[232px]">
            <InputFormSlim
              ref={emailCheckRef}
              type="email"
              title="useremail"
              placeholder="이메일을 한번 더 입력해주세요."
              value={emailCheckValue}
              onChange={handleEmailCheck}
              iconDelete={!!emailCheckValue}
              onClickDelete={handleDeleteEmailCheck}
            />
          </div>
        </li>
        <div className="mt-[60px] w-full">
          <ButtonVariable buttonText="회원탈퇴" variant={variant} />
        </div>
      </form>
      {isModalOpen && (
        <ModalComp
          children="회원 탈퇴가 완료되었습니다."
          confirmText="확인"
          onClickConfirm={onClickConfirm}
        />
      )}
    </div>
  );
};

export default MypageDelete;
