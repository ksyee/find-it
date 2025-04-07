import { signUp } from '@/lib/utils/auth';
import { supabase } from '@/lib/api/supabase';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header/Header';
import InputForm from '@/components/SignIn/molecule/InputForm';
import {
  GetSidoList,
  GetGunguList,
  GetCode,
} from '@/components/SignIn/molecule/GetLocalList';
import ButtonVariable from '@/components/common/molecule/ButtonVariable';
import ButtonSelectItem from '@/components/common/molecule/ButtonSelectItem';
import SelectCategoryList from '@/components/common/molecule/SelectCategoryList';

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

type ConfirmProps = 'doubleCheckEmail' | 'doubleCheckNickname' | '';

const SignUp = () => {
  /* -------------------------------------------------------------------------- */
  // 유효성 검사용 정규식 : 비번 8자이상 20자 이하영문 숫자 특수문자 포함
  const regex = {
    emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    pwRegex: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
  };
  /* -------------------------------------------------------------------------- */
  const [emailValue, setEmailValue] = useState('');
  const [valiEmailDouble, setValiEmailDouble] = useState(false);
  const [valiEmailForm, setValiEmailForm] = useState(false);

  const [passwordValue, setPasswordValue] = useState('');
  const [valiPasswordForm, setValiPasswordForm] = useState(false);

  const [passwordType, setPasswordType] = useState('password');
  const [passwordCheckValue, setPasswordCheckValue] = useState('');
  const [passwordCheckType, setPasswordCheckType] = useState('password');

  const [nicknameValue, setNicknameValue] = useState('');
  const [valiNickDouble, setValiNickDouble] = useState(false);

  const [alertEmail, setAlertEmail] = useState<AlertProps>();
  const [confirmEmail, setConfirmEmail] = useState<ConfirmProps>();
  const [alertPassword, setAlertPassword] = useState<AlertProps>();
  const [alertPasswordCheck, setAlertPasswordCheck] = useState<AlertProps>();
  const [alertNickname, setAlertNickname] = useState<AlertProps>();
  const [confirmNickname, setConfirmNickname] = useState<ConfirmProps>();

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
    setConfirmEmail('');

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
    setConfirmNickname('');
    setValiNickDouble(false);
  };

  /* -------------------------------------------------------------------------- */

  // 이메일 중복 확인
  const handleDoubleCheckEmail = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('email')
        .eq('email', emailValue);

      if (data && data.length > 0) {
        setAlertEmail('doubleCheckEmail');
        setValiEmailDouble(false);
      } else {
        setAlertEmail('');
        setConfirmEmail('doubleCheckEmail');
        setValiEmailDouble(true);
      }
    } catch (error) {
      console.log('이메일 중복확인 에러', error);
    }
  };

  // 닉네임 중복확인
  const handleDoubleCheckNickname = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('nickname')
        .eq('nickname', nicknameValue);

      if (data && data.length > 0) {
        setAlertNickname('doubleCheckNickname');
        setValiNickDouble(false);
      } else {
        setAlertNickname('');
        setConfirmNickname('doubleCheckNickname');
        setValiNickDouble(true);
      }
    } catch (error) {
      console.log('닉네임 중복확인 에러', error);
    }
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
    setConfirmEmail('');
    setValiEmailDouble(false);
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
    setConfirmNickname('');
    setValiNickDouble(false);
  };

  /* -------------------------------------------------------------------------- */
  // 지역 선택 버튼

  // 대분류 버튼 클릭시 대분류 리스트 랜더링 & 소분류 비활성화 & 소분류 초기화
  const [renderFirstList, setRenderFirstList] = useState(false);
  const [disabledSecond, setDisabledSecond] = useState(true);
  const handleFirstItem = (): void => {
    setRenderFirstList(true);
    setSelectSecondItem('');
    setDisabledSecond(true);
  };
  // 소분류 버튼 클릭시 소분류 리스트 랜더링
  const [renderSecondList, setRenderSecondList] = useState(false);
  const handleSecondItem = (): void => {
    setRenderSecondList(true);
  };
  // 값 선택 변수들
  const [selectFirstItem, setSelectFirstItem] = useState('');
  const [selectSecondItem, setSelectSecondItem] = useState('');
  // 값 선택시 연계 작동 함수들
  const handleSelectFirstItem = (item: string): void => {
    // 아이템이 없거나 빈 문자열인 경우 선택하지 않음
    if (!item) {
      return;
    }
    setSelectFirstItem(item);
    setDisabledSecond(false);

    // 시도 선택 리스트를 닫고 군구 선택 리스트를 자동으로 표시
    setRenderFirstList(false);

    // 잠시 후 군구 리스트 표시 (애니메이션 효과를 위해 약간의 딜레이 적용)
    setTimeout(() => {
      setRenderSecondList(true);
    }, 100);
  };
  const handleSelectSecondItem = (item: string): void => {
    // 아이템이 없거나 빈 문자열인 경우 선택하지 않음
    if (!item) {
      return;
    }
    setSelectSecondItem(item);

    // 군구 리스트 닫기
    setRenderSecondList(false);
  };

  // 정적 시도 데이터 (GetSidoList 대신 사용)
  const staticSidoList = [
    '서울특별시',
    '경기도',
    '인천광역시',
    '강원도',
    '경상남도',
    '경상북도',
    '대구광역시',
    '울산광역시',
    '부산광역시',
    '전라남도',
    '전라북도',
    '광주광역시',
    '충청남도',
    '충청북도',
    '대전광역시',
    '세종특별자치시',
    '제주특별자치도',
  ];

  // 정적 군구 데이터 (GetGunguList 대신 사용)
  const staticGunguMap: { [key: string]: string[] } = {
    서울특별시: [
      '강남구',
      '강동구',
      '강북구',
      '강서구',
      '관악구',
      '광진구',
      '구로구',
      '금천구',
      '노원구',
      '도봉구',
      '동대문구',
      '동작구',
      '마포구',
      '서대문구',
      '서초구',
      '성동구',
      '성북구',
      '송파구',
      '양천구',
      '영등포구',
      '용산구',
      '은평구',
      '종로구',
      '중구',
      '중랑구',
    ],
    경기도: [
      '수원시',
      '고양시',
      '용인시',
      '성남시',
      '부천시',
      '안산시',
      '안양시',
      '평택시',
      '시흥시',
      '김포시',
      '광주시',
      '광명시',
      '파주시',
      '군포시',
      '오산시',
      '이천시',
      '양주시',
      '안성시',
      '구리시',
      '포천시',
      '의왕시',
      '하남시',
      '여주시',
      '양평군',
      '동두천시',
      '과천시',
      '가평군',
      '연천군',
    ],
    인천광역시: [
      '중구',
      '동구',
      '미추홀구',
      '연수구',
      '남동구',
      '부평구',
      '계양구',
      '서구',
      '강화군',
      '옹진군',
    ],
    강원도: [
      '춘천시',
      '원주시',
      '강릉시',
      '동해시',
      '태백시',
      '속초시',
      '삼척시',
      '홍천군',
      '횡성군',
      '영월군',
      '평창군',
      '정선군',
      '철원군',
      '화천군',
      '양구군',
      '인제군',
      '고성군',
      '양양군',
    ],
    충청북도: [
      '청주시',
      '충주시',
      '제천시',
      '보은군',
      '옥천군',
      '영동군',
      '증평군',
      '진천군',
      '괴산군',
      '음성군',
      '단양군',
    ],
    충청남도: [
      '천안시',
      '공주시',
      '보령시',
      '아산시',
      '서산시',
      '논산시',
      '계룡시',
      '당진시',
      '금산군',
      '부여군',
      '서천군',
      '청양군',
      '홍성군',
      '예산군',
      '태안군',
    ],
    전라북도: [
      '전주시',
      '군산시',
      '익산시',
      '정읍시',
      '남원시',
      '김제시',
      '완주군',
      '진안군',
      '무주군',
      '장수군',
      '임실군',
      '순창군',
      '고창군',
      '부안군',
    ],
    전라남도: [
      '목포시',
      '여수시',
      '순천시',
      '나주시',
      '광양시',
      '담양군',
      '곡성군',
      '구례군',
      '고흥군',
      '보성군',
      '화순군',
      '장흥군',
      '강진군',
      '해남군',
      '영암군',
      '무안군',
      '함평군',
      '영광군',
      '장성군',
      '완도군',
      '진도군',
      '신안군',
    ],
    경상북도: [
      '포항시',
      '경주시',
      '김천시',
      '안동시',
      '구미시',
      '영주시',
      '영천시',
      '상주시',
      '문경시',
      '경산시',
      '군위군',
      '의성군',
      '청송군',
      '영양군',
      '영덕군',
      '청도군',
      '고령군',
      '성주군',
      '칠곡군',
      '예천군',
      '봉화군',
      '울진군',
      '울릉군',
    ],
    경상남도: [
      '창원시',
      '진주시',
      '통영시',
      '사천시',
      '김해시',
      '밀양시',
      '거제시',
      '양산시',
      '의령군',
      '함안군',
      '창녕군',
      '고성군',
      '남해군',
      '하동군',
      '산청군',
      '함양군',
      '거창군',
      '합천군',
    ],
    대구광역시: [
      '중구',
      '동구',
      '서구',
      '남구',
      '북구',
      '수성구',
      '달서구',
      '달성군',
    ],
    부산광역시: [
      '중구',
      '서구',
      '동구',
      '영도구',
      '부산진구',
      '동래구',
      '남구',
      '북구',
      '해운대구',
      '사하구',
      '금정구',
      '강서구',
      '연제구',
      '수영구',
      '사상구',
      '기장군',
    ],
    울산광역시: ['중구', '남구', '동구', '북구', '울주군'],
    광주광역시: ['동구', '서구', '남구', '북구', '광산구'],
    대전광역시: ['동구', '중구', '서구', '유성구', '대덕구'],
    세종특별자치시: ['세종시'],
    제주특별자치도: ['제주시', '서귀포시'],
  };

  // 대분류 리스트
  const firstItemList = staticSidoList;

  // 소분류 리스트 생성
  const secondItemList =
    selectFirstItem && staticGunguMap[selectFirstItem]
      ? staticGunguMap[selectFirstItem]
      : [];

  /* -------------------------------------------------------------------------- */
  // 제출버튼 시작
  // 최종 가입 데이터 모음
  interface UserDataType {
    email: string;
    nickname: string;
    state: string;
    city: string;
    [key: string]: string;
  }

  const newUserData: UserDataType = {
    email: emailValue,
    nickname: nicknameValue,
    state: selectFirstItem,
    city: selectSecondItem,
  };

  // 회원가입 버튼 활성화 조건 : 전부 충족해야됨
  type VariantType = 'submit' | 'disabled';
  const [variant, setVariant] = useState<VariantType>('disabled');

  // 폼 검사 : 이메일 정규식 & 중복, 비밀번호 규칙, 비밀번호 체크 & 닉네임 중복
  useEffect(() => {
    if (
      valiEmailForm &&
      valiEmailDouble &&
      valiPasswordForm &&
      passwordValue === passwordCheckValue &&
      !!passwordCheckValue &&
      valiNickDouble &&
      !!selectFirstItem &&
      !!selectSecondItem
    ) {
      setVariant('submit');
    } else {
      setVariant('disabled');
    }
  }, [
    valiEmailForm,
    valiEmailDouble,
    valiPasswordForm,
    passwordValue,
    passwordCheckValue,
    valiNickDouble,
    selectFirstItem,
    selectSecondItem,
  ]);

  // 최종 회원가입 함수
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (variant === 'submit') {
      try {
        // Supabase 회원가입 처리
        const userData = await signUp(emailValue, passwordValue, newUserData);

        // 가입 성공 시 로그인 처리 및 페이지 이동
        if (userData) {
          window.location.href = '/welcome';
        }
      } catch (error) {
        console.error('회원가입 에러:', error);
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------- */
  // jsx 반환
  return (
    <>
      <div className="flex flex-col items-center ">
        <Header isShowPrev={true} children="회원가입" empty={true} />
        <div className="flex flex-col items-center">
          <form className="w-375px px-20px pt-30px" onSubmit={createUser}>
            <InputForm
              ref={emailRef}
              type="email"
              title="useremail"
              placeholder="이메일 주소를 입력해주세요."
              value={emailValue}
              onChange={handleEmail}
              iconDoubleCheck={true}
              iconDelete={!!emailValue}
              onClickDoubleCheck={handleDoubleCheckEmail}
              onClickDelete={handleDeleteEmail}
              alertCase={alertEmail}
              confirmCase={confirmEmail}
              disabledDoubleCheck={!valiEmailForm}
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
              iconDoubleCheck={true}
              iconDelete={!!nicknameValue}
              onClickDoubleCheck={handleDoubleCheckNickname}
              onClickDelete={handleDeleteNickname}
              alertCase={alertNickname}
              confirmCase={confirmNickname}
              disabledDoubleCheck={!nicknameValue}
            />
            <div className="mt-10px flex h-48px w-full items-center justify-between ">
              <input
                style={{ pointerEvents: 'none', cursor: 'default' }}
                className="text-#989898 w-full pl-2.5 pr-2.5 text-14px"
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
                hasFirstSelection={!!selectFirstItem}
                hasSecondSelection={!!selectSecondItem}
              />
            </div>
            <div className="box-border flex flex-col items-center gap-[1rem]	pt-80px">
              <ButtonVariable buttonText="완료" variant={variant} />
            </div>
          </form>
        </div>
        {renderFirstList && (
          <SelectCategoryList
            title={'거주하시는 시/도를 선택하세요.'}
            dataList={firstItemList}
            getSelectItem={handleSelectFirstItem} // 선택 아이템 가져옴
            initialSelectedItem={selectFirstItem}
            onClose={() => {
              setRenderFirstList(false);
              // 시도가 선택되지 않았다면 군구 선택도 비활성화 유지
              if (!selectFirstItem) {
                setDisabledSecond(true);
              }
            }}
          />
        )}
        {renderSecondList && (
          <SelectCategoryList
            title={'거주하시는 군/구를 선택하세요.'}
            dataList={secondItemList}
            getSelectItem={handleSelectSecondItem}
            initialSelectedItem={selectSecondItem}
            onClose={() => setRenderSecondList(false)}
          />
        )}
      </div>
    </>
  );
};

export default SignUp;
