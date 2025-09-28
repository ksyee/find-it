import * as React from 'react';

export type AlertCase =
  | 'doubleCheckEmail'
  | 'doubleCheckNickname'
  | 'doubleCheckPassword'
  | 'invalidValue'
  | 'invalidEmail'
  | 'invalidPassword'
  | 'userEmail'
  | 'userEmailDouble';

const ALERT_MESSAGES: Record<AlertCase, string> = {
  doubleCheckEmail: '이미 사용 중인 이메일 주소입니다.',
  doubleCheckNickname: '이미 사용 중인 닉네임 입니다.',
  doubleCheckPassword: '비밀번호가 일치하지 않습니다.',
  invalidValue: '이메일 또는 비밀번호를 다시 확인해주세요.',
  invalidEmail: '이메일 형식에 맞게 입력해주세요.',
  invalidPassword:
    '비밀번호는 영어, 숫자, 특수문자를 포함하여\n8자 이상으로 설정해주세요.',
  userEmail: '이메일 주소를 확인해주세요.',
  userEmailDouble: '회원정보가 일치하지 않습니다.',
};

export interface AlertTextProps {
  alertCase?: AlertCase | '';
  className?: string;
  children?: React.ReactNode;
}

/**
 * 경고 메시지를 표시하는 컴포넌트
 * @param alertCase - 표시할 경고 메시지 유형
 * @param className - 추가 스타일 클래스
 * @param children - 기본 메시지 대신 직접 지정할 메시지 내용
 */
const AlertText: React.FC<AlertTextProps> = ({
  alertCase = '',
  className = '',
  children = null,
}) => {
  // 경고 케이스가 없거나 정의되지 않은 경우 렌더링 안함
  if (!alertCase || !(alertCase in ALERT_MESSAGES)) {
    return null;
  }

  // 기본 메시지 또는 직접 제공된 내용 사용
  const content = children || ALERT_MESSAGES[alertCase as AlertCase];

  return (
    <span
      role="alert"
      aria-live="assertive"
      className={`text-secondary inline-block w-[244px] pt-[8px] pl-[10px] text-left text-[12px] ${className}`}
    >
      {content}
    </span>
  );
};

export default AlertText;
