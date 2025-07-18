import { useState } from 'react';
import IconDelete from '@/components/common/atom/IconDelete';
import IconEyeOff from '@/components/SignIn/atom/IconEyeOff';
import IconEyeOn from '@/components/SignIn/atom/IconEyeOn';
import IconDoubleCheck from '@/components/SignIn/atom/IconDoubleCheck';

interface IconProps {
  isShow: boolean;
  onClickDoubleCheck?: () => void;
  onClickDelete?: () => void;
  onClickEye?: () => void;
  disabledDoubleCheck?: boolean;
}
/* -------------------------------------------------------------------------- */
const DoubleCheck = ({
  isShow,
  onClickDoubleCheck,
  disabledDoubleCheck,
}: IconProps) => {
  const doubleCheckcolor = (!disabledDoubleCheck && 'black') || '#bcbcbc';
  if (isShow) {
    return (
      <button
        type="button"
        onClick={onClickDoubleCheck}
        disabled={disabledDoubleCheck}
      >
        <IconDoubleCheck color={doubleCheckcolor} />
      </button>
    );
  } else {
    return null;
  }
};
/* -------------------------------------------------------------------------- */
const DeleteContent = ({ isShow, onClickDelete }: IconProps) => {
  if (isShow) {
    return (
      <button type="button" onClick={onClickDelete}>
        <IconDelete color="#4785ff" />
      </button>
    );
  } else {
    return null;
  }
};
/* -------------------------------------------------------------------------- */
const EyeToggle = ({ isShow, onClickEye }: IconProps) => {
  const [isEyeOn, setIsEyeOn] = useState(false);
  const toggleEye = () => {
    setIsEyeOn(!isEyeOn);
    if (onClickEye) {
      onClickEye();
    }
  };

  if (isShow) {
    return (
      <>
        <button type="button" onClick={toggleEye}>
          {isEyeOn && <IconEyeOn />}
          {!isEyeOn && <IconEyeOff />}
        </button>
      </>
    );
  } else {
    return null;
  }
};
/* -------------------------------------------------------------------------- */
// 최종 실행 함수

interface InputIconButtonProps {
  iconDoubleCheck: boolean;
  iconDelete: boolean;
  iconEyeToggle: boolean;
  onClickDoubleCheck?: () => void;
  onClickDelete?: () => void;
  onClickEye?: () => void;
  disabledDoubleCheck?: boolean;
}
export const InputIconButton = ({
  iconDoubleCheck = false,
  iconDelete = false,
  iconEyeToggle = false,
  onClickDoubleCheck,
  onClickDelete,
  onClickEye,
  disabledDoubleCheck,
}: InputIconButtonProps) => {
  return (
    <div className="flex gap-[10px] pr-[12px]">
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
