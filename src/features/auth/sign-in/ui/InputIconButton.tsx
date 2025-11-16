import { useState } from 'react';
import IconDelete from '@/shared/ui/icons/IconDelete';
import IconEyeOff from '@/shared/ui/icons/IconEyeOff';
import IconEyeOn from '@/shared/ui/icons/IconEyeOn';
import IconDoubleCheck from '@/shared/ui/icons/IconDoubleCheck';

interface IconProps {
  isShow: boolean;
  onClickDoubleCheck?: () => void;
  onClickDelete?: () => void;
  onClickEye?: () => void;
  disabledDoubleCheck?: boolean;
}
const DoubleCheck = ({
  isShow,
  onClickDoubleCheck,
  disabledDoubleCheck
}: IconProps) => {
  if (!isShow) {
    return null;
  }

  const doubleCheckColor = (!disabledDoubleCheck && 'black') || '#bcbcbc';
  return (
    <button
      type="button"
      onClick={onClickDoubleCheck}
      disabled={disabledDoubleCheck}
    >
      <IconDoubleCheck color={doubleCheckColor} />
    </button>
  );
};

const DeleteContent = ({ isShow, onClickDelete }: IconProps) => {
  if (!isShow) {
    return null;
  }

  return (
    <button type="button" onClick={onClickDelete}>
      <IconDelete color="#4785ff" />
    </button>
  );
};

const EyeToggle = ({ isShow, onClickEye }: IconProps) => {
  const [isEyeOn, setIsEyeOn] = useState(false);

  const toggleEye = () => {
    setIsEyeOn((prev) => !prev);
    onClickEye?.();
  };

  if (!isShow) {
    return null;
  }

  return (
    <button type="button" onClick={toggleEye}>
      {isEyeOn ? <IconEyeOn /> : <IconEyeOff />}
    </button>
  );
};

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
  disabledDoubleCheck
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
