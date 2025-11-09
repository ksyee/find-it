import { useEffect, useRef, useState } from 'react';
import { ClientResponseError } from 'pocketbase';
import { pb } from '@/lib/api/getPbData';
import { createData } from '@/lib/utils/crud';
import Header from '@/widgets/header/ui/Header';
import InputForm from '@/features/auth/sign-in/ui/InputForm';
import {
  GetSidoList,
  GetGunguList,
  GetCode
} from '@/features/auth/sign-in/ui/GetLocalList';
import ButtonVariable from '@/shared/ui/buttons/ButtonVariable';
import ButtonSelectItem from '@/shared/ui/select/ButtonSelectItem';
import SelectCategoryList from '@/shared/ui/select/SelectCategoryList';

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

const SignUp = () => {
  /* -------------------------------------------------------------------------- */
  // 유효성 검사용 정규식 : 비번 8자이상 20자 이하영문 숫자 특수문자 포함
  const regex = {
    emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    pwRegex: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/
  };
  /* -------------------------------------------------------------------------- */
  const [emailValue, setEmailValue] = useState('');
  const [valiEmailForm, setValiEmailForm] = useState(false);

  const [passwordValue, setPasswordValue] = useState('');
  const [valiPasswordForm, setValiPasswordForm] = useState(false);

  const [passwordType, setPasswordType] = useState('password');
  const [passwordCheckValue, setPasswordCheckValue] = useState('');
  const [passwordCheckType, setPasswordCheckType] = useState('password');

  const [nicknameValue, setNicknameValue] = useState('');

  const [alertEmail, setAlertEmail] = useState<AlertProps>();
  const [alertPassword, setAlertPassword] = useState<AlertProps>();
  const [alertPasswordCheck, setAlertPasswordCheck] = useState<AlertProps>();
  const [alertNickname, setAlertNickname] = useState<AlertProps>();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const nicknameRef = useRef(null);

  /* -------------------------------------------------------------------------- */
  // 이메일 입력 & 정규식 검사
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = e.target.value;
    setEmailValue(newValue);

    if (!newValue.match(regex.emailRegex)) {
      setAlertEmail('invalidEmail');
      setValiEmailForm(false);
    } else {
      setAlertEmail('');
      setValiEmailForm(true);
    }
  };
  // 비밀번호 입력 & 정규식 검사
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPasswordValue(newValue);
    if (!newValue.match(regex.pwRegex)) {
      setAlertPassword('invalidPassword');
      setValiPasswordForm(false);
    } else {
      setAlertPassword('');
      setValiPasswordForm(true);
    }
  };
  // 비밀번호 입력 & 동일 검사
  const handlePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPasswordCheckValue(newValue);
    if (newValue !== passwordValue) {
      setAlertPasswordCheck('doubleCheckPassword');
    } else {
      setAlertPasswordCheck('');
    }
  };
  // 닉네임 입력 & 중복검사 문구 지우기, 중복검사 상태 지우기
  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNicknameValue(newValue);
    setAlertNickname('');
  };

  /* -------------------------------------------------------------------------- */

  const handleUnavailableCheck = () => {
    setSubmitError('중복 확인 기능을 사용할 수 없습니다. 완료 버튼을 눌러 가입을 진행해 주세요.');
  };
  // 비번 보이기 눈 버튼 : 인풋 타입을 텍스트로 바꿈
  const handleEyePassword = () => {
    setPasswordType((passwordType === 'password' && 'text') || 'password');
  };
  const handleEyePasswordCheck = () => {
    setPasswordCheckType(
      (passwordCheckType === 'password' && 'text') || 'password'
    );
  };
  /* -------------------------------------------------------------------------- */
  // 딜리트 버튼 실행 : 값초기화와 빈문자로 바꾸기
  const handleDeleteEmail = () => {
    setEmailValue('');
    setAlertEmail('');
  };
  const handleDeletePassword = () => {
    setPasswordValue('');
    setAlertPassword('');
  };
  const handleDeletePasswordCheck = () => {
    setPasswordCheckValue('');
    setAlertPasswordCheck('');
  };
  const handleDeleteNickname = () => {
    setNicknameValue('');
    setAlertNickname('');
  };

  /* -------------------------------------------------------------------------- */
  // 지역 선택 버튼

  // 대분류 버튼 클릭시 대분류 리스트 랜더링 & 소분류 비활성화 & 소분류 초기화
  const [renderFirstList, setRenderFirstList] = useState(false);
  const [disabledSecond, setDisabledSecond] = useState(true);
  const handleFirstItem = () => {
    setRenderFirstList(true);
    setSelectSecondItem('');
    setDisabledSecond(true);
  };
  // 소분류 버튼 클릭시 소분류 리스트 랜더링
  const [renderSecondList, setRenderSecondList] = useState(false);
  const handleSecondItem = () => {
    setRenderSecondList(true);
  };

  // 렌더된 리스트 (SelectCategoryList 컴포넌트) 에서 찍은거 가져오기
  // 첫번째 아이템 리스트
  const [selectFirstItem, setSelectFirstItem] = useState('');
  const handleSelectFirstItem = (item: string) => {
    setSelectFirstItem(item);
  };
  // 두번째 아이템 리스트
  const [selectSecondItem, setSelectSecondItem] = useState('');
  const handleSelectSecondItem = (item: string) => {
    setSelectSecondItem(item);
  };
  // 뿌릴 데이터 종류 전달
  const LOCAL_CODE = GetCode(selectFirstItem);
  const firstItemList = GetSidoList(); // 문자열로 된 배열 반환
  const secondItemList = GetGunguList(LOCAL_CODE || selectFirstItem);

  /* -------------------------------------------------------------------------- */
  // 신규 유저 데이터
  const newUserData = {
    email: emailValue,
    emailVisibility: true,
    password: passwordValue,
    passwordConfirm: passwordCheckValue,
    nickname: nicknameValue,
    state: selectFirstItem,
    city: selectSecondItem
  };
  /* -------------------------------------------------------------------------- */
  // 최종 버튼 활성화 조건 버튼 변경 & 데이터 보내기
  const [variant, setVariant] = useState<'submit' | 'disabled'>('disabled');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  useEffect(() => {
    const hasEmail = emailValue !== '' && valiEmailForm;
    const hasValidPassword =
      valiPasswordForm &&
      passwordValue !== '' &&
      passwordValue === passwordCheckValue;
    const hasNickname = nicknameValue.trim() !== '';
    const hasLocation = selectFirstItem !== '' && selectSecondItem !== '';

    if (hasEmail && hasValidPassword && hasNickname && hasLocation) {
      setVariant('submit');
    } else {
      setVariant('disabled');
    }
  }, [
    emailValue,
    valiEmailForm,
    valiPasswordForm,
    passwordValue,
    passwordCheckValue,
    nicknameValue,
    selectFirstItem,
    selectSecondItem
  ]);

  // 유저 데이터 pb에 쓰기
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (variant !== 'submit' || isSubmitting) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const userData = await createData('users', newUserData);
      await pb.collection('users').authWithPassword(emailValue, passwordValue);
      window.location.href = '/welcome';
      return userData;
    } catch (error) {
      console.error('회원가입 유저 데이터 보내기 에러났슈:', error);
      setSubmitError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------- */
  // jsx 반환
  return (
    <div className="min-h-nav-safe flex w-full flex-col items-center bg-white md:mt-5">
      <Header isShowPrev={true} children="회원가입" empty={true} />
      <div className="flex w-full flex-col items-center pt-[66px] md:pt-0">
        <div className="flex flex-col items-center">
          <form className="w-[375px] px-5 pb-10" onSubmit={createUser}>
            <InputForm
              ref={emailRef}
              type="email"
              title="useremail"
              placeholder="이메일 주소를 입력해주세요."
              value={emailValue}
              onChange={handleEmail}
              iconDelete={!!emailValue}
              onClickDoubleCheck={handleUnavailableCheck}
              onClickDelete={handleDeleteEmail}
              alertCase={alertEmail}
              iconDoubleCheck={false}
            />
            <InputForm
              ref={passwordRef}
              marginTop="40px"
              type={passwordType}
              title="userpassword"
              placeholder="비밀번호를 입력해주세요."
              value={passwordValue}
              onChange={handlePassword}
              iconDoubleCheck={false}
              iconDelete={!!passwordValue}
              iconEyeToggle={true}
              onClickDelete={handleDeletePassword}
              onClickEye={handleEyePassword}
              alertCase={alertPassword}
            />
            <InputForm
              marginTop="8px"
              ref={passwordCheckRef}
              type={passwordCheckType}
              title="userpasswordCheck"
              placeholder="비밀번호를 한번 더 입력해주세요."
              value={passwordCheckValue}
              onChange={handlePasswordCheck}
              iconDoubleCheck={false}
              iconDelete={!!passwordCheckValue}
              iconEyeToggle={true}
              onClickDelete={handleDeletePasswordCheck}
              onClickEye={handleEyePasswordCheck}
              alertCase={alertPasswordCheck}
            />
            <InputForm
              marginTop="40px"
              ref={nicknameRef}
              type="text"
              title="nickname"
              placeholder="닉네임을 입력해주세요."
              value={nicknameValue}
              onChange={handleNickname}
              iconDoubleCheck={false}
              iconDelete={!!nicknameValue}
              onClickDoubleCheck={handleUnavailableCheck}
              onClickDelete={handleDeleteNickname}
              alertCase={alertNickname}
            />
            <p className="pt-2 text-xs text-gray-400">
              중복 확인 기능은 현재 사용할 수 없습니다. 완료 버튼을 눌러 가입을 진행해 주세요.
            </p>
            <div className="mt-2.5 flex h-12 w-full items-center justify-between">
              <input
                style={{ pointerEvents: 'none', cursor: 'default' }}
                className="text-#989898 w-full pr-2.5 pl-2.5 text-sm"
                type="text"
                name="거주지역"
                readOnly
                placeholder="거주지역을 선택해주세요"
              />
              <ButtonSelectItem
                firstName={selectFirstItem || '시/도'}
                secondName={selectSecondItem || '군/구'}
                onClickFirst={handleFirstItem} // 컴포넌트 렌더 실행
            onClickSecond={handleSecondItem}
            disabledSecond={disabledSecond}
          />
        </div>
        {submitError && (
          <p className="pt-4 text-sm text-red-500">{submitError}</p>
        )}
        <div className="box-border flex flex-col items-center gap-4 pt-20">
          <ButtonVariable
            buttonText={isSubmitting ? '처리 중...' : '완료'}
            variant={isSubmitting ? 'disabled' : variant}
          />
        </div>
      </form>
    </div>
    {renderFirstList && (
          <SelectCategoryList
            title={'거주하시는 시/도를 선택하세요.'}
            dataList={firstItemList}
            getSelectItem={handleSelectFirstItem} // 선택 아이템 가져옴
            onClose={() => setRenderFirstList(false)} // 바깥 영역 누르면 사라짐
          />
        )}
        {renderSecondList && (
          <SelectCategoryList
            title={'거주하시는 군/구를 선택하세요.'}
            dataList={secondItemList}
            getSelectItem={handleSelectSecondItem}
            onClose={() => setRenderSecondList(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SignUp;
