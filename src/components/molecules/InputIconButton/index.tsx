import * as React from 'react';
import { useState } from 'react';
import IconDelete from '@/components/atoms/icons/IconDelete';
import IconEyeOff from '@/components/atoms/icons/IconEyeOff';
import IconEyeOn from '@/components/atoms/icons/IconEyeOn';
import IconDoubleCheck from '@/components/atoms/icons/IconDoubleCheck';

interface IconProps {
  isShow: boolean;
  onClickDoubleCheck?: () => void;
  onClickDelete?: () => void;
  onClickEye?: () => void;
  disabledDoubleCheck?: boolean;
  className?: string;
}

/**
 * 중복 확인 버튼 컴포넌트
 */
const DoubleCheck: React.FC<IconProps> = ({
  isShow,
  onClickDoubleCheck,
  disabledDoubleCheck,
  className = '',
}) => {
  const doubleCheckcolor = (!disabledDoubleCheck && 'black') || '#bcbcbc';
  
  if (!isShow) return null;
  
  return (
    <button
      type="button"
      onClick={onClickDoubleCheck}
      disabled={disabledDoubleCheck}
      className={className}
      aria-label="중복 확인"
    >
      <IconDoubleCheck color={doubleCheckcolor} />
    </button>
  );
};

/**
 * 삭제 버튼 컴포넌트
 */
const DeleteContent: React.FC<IconProps> = ({ 
  isShow, 
  onClickDelete,
  className = '', 
}) => {
  if (!isShow) return null;
  
  return (
    <button 
      type="button" 
      onClick={onClickDelete} 
      className={className}
      aria-label="내용 삭제"
    >
      <IconDelete color="#4785ff" />
    </button>
  );
};

/**
 * 비밀번호 표시/숨김 버튼 컴포넌트
 */
const EyeToggle: React.FC<IconProps> = ({ 
  isShow, 
  onClickEye,
  className = '', 
}) => {
  const [isEyeOn, setIsEyeOn] = useState(false);
  
  const toggleEye = () => {
    setIsEyeOn(!isEyeOn);
    if (onClickEye) {
      onClickEye();
    }
  };

  if (!isShow) return null;
  
  return (
    <button 
      type="button" 
      onClick={toggleEye} 
      className={className}
      aria-label={isEyeOn ? "비밀번호 숨기기" : "비밀번호 표시"}
    >
      {isEyeOn ? <IconEyeOn /> : <IconEyeOff />}
    </button>
  );
};

export interface InputIconButtonProps {
  /**
   * 중복 확인 아이콘 표시 여부
   */
  iconDoubleCheck?: boolean;
  /**
   * 삭제 아이콘 표시 여부
   */
  iconDelete?: boolean;
  /**
   * 눈 토글 아이콘 표시 여부
   */
  iconEyeToggle?: boolean;
  /**
   * 중복 확인 버튼 클릭 핸들러
   */
  onClickDoubleCheck?: () => void;
  /**
   * 삭제 버튼 클릭 핸들러
   */
  onClickDelete?: () => void;
  /**
   * 눈 토글 버튼 클릭 핸들러
   */
  onClickEye?: () => void;
  /**
   * 중복 확인 버튼 비활성화 여부
   */
  disabledDoubleCheck?: boolean;
  /**
   * 추가 스타일 클래스
   */
  className?: string;
}

/**
 * 입력 필드에 표시되는 아이콘 버튼 그룹 컴포넌트
 */
const InputIconButton: React.FC<InputIconButtonProps> = ({
  iconDoubleCheck = false,
  iconDelete = false,
  iconEyeToggle = false,
  onClickDoubleCheck,
  onClickDelete,
  onClickEye,
  disabledDoubleCheck,
  className = '',
}) => {
  return (
    <div className={`flex gap-[10px] pr-[12px] ${className}`}>
      <DoubleCheck
        isShow={iconDoubleCheck}
        onClickDoubleCheck={onClickDoubleCheck}
        disabledDoubleCheck={disabledDoubleCheck}
      />
      <DeleteContent isShow={iconDelete} onClickDelete={onClickDelete} />
      <EyeToggle isShow={iconEyeToggle} onClickEye={onClickEye} />
    </div>
  );
};

export default InputIconButton;
