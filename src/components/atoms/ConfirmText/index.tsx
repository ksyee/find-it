import * as React from 'react';

export type ConfirmCase = 'doubleCheckEmail' | 'doubleCheckNickname';

const CONFIRM_MESSAGES: Record<ConfirmCase, string> = {
  doubleCheckEmail: '사용 가능한 이메일 주소입니다.',
  doubleCheckNickname: '사용 가능한 닉네임 입니다.',
};

export interface ConfirmTextProps {
  confirmCase?: ConfirmCase | '';
  className?: string;
  children?: React.ReactNode;
}

/**
 * 확인 메시지를 표시하는 컴포넌트
 * @param confirmCase - 표시할 확인 메시지 유형
 * @param className - 추가 스타일 클래스
 * @param children - 기본 메시지 대신 직접 지정할 메시지 내용
 */
const ConfirmText: React.FC<ConfirmTextProps> = ({ confirmCase = '', className = '', children = null }) => {
  // 확인 케이스가 없거나 정의되지 않은 경우 렌더링 안함
  if (!confirmCase || !(confirmCase in CONFIRM_MESSAGES)) {
    return null;
  }

  // 기본 메시지 또는 직접 제공된 내용 사용
  const content = children || CONFIRM_MESSAGES[confirmCase as ConfirmCase];

  return (
    <span
      role="status"
      className={`inline-block w-[244px] pl-[10px] pt-[8px] text-left text-[12px] text-primary ${className}`}
    >
      {content}
    </span>
  );
};

export default ConfirmText;
