import { forwardRef, useState } from 'react';
import AlertText, { AlertCase } from '@/shared/ui/feedback/AlertText';
import ConfirmText, { ConfirmCase } from '@/shared/ui/feedback/ConfirmText';
import InputIconButton from '@/features/auth/sign-in/ui/InputIconButton';

interface InputFormProps {
  type?: string;
  title: string;
  placeholder: string;
  value: string;
  alertCase?: AlertCase | '';
  confirmCase?: ConfirmCase | '';

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconDoubleCheck?: boolean;
  iconDelete?: boolean;
  iconEyeToggle?: boolean;
  onClickDoubleCheck?: () => void;
  onClickDelete?: () => void;
  onClickEye?: () => void;
  disabledDoubleCheck?: boolean;
}

const InputForm: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputFormProps
> = (
  {
    type = 'text',
    title,
    placeholder,
    value,
    alertCase,
    confirmCase,

    onChange,
    iconDoubleCheck,
    iconDelete,
    iconEyeToggle,
    onClickDoubleCheck,
    onClickDelete,
    onClickEye,
    disabledDoubleCheck,
    ...resProps
  },
  ref
) => {
  // 포커스 상태에 따라 보더 색상을 조정한다.
  const [isFocus, setIsFocus] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && typeof ref === 'object' && ref?.current) {
      ref.current.blur();
    }
  };

  const handleFocus = () => {
    setIsFocus(true);
  };
  const handleBlur = () => {
    setIsFocus(false);
  };

  const defaultColor = '#f5f5f5';
  const activeColor = '#4785ff';
  const borderColor = (isFocus && activeColor) || defaultColor;

  return (
    <>
      <div
        className="flex h-[36px] w-full items-center justify-between bg-gray-100"
        style={{ borderBottom: `1.5px solid ${borderColor}` }}
      >
        <label className="sr-only">{title}</label>
        <input
          className="w-full bg-gray-100 pl-2.5 pr-2.5 text-xs text-black"
          style={{ outline: 'none' }}
          ref={ref}
          type={type}
          name={title}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...resProps}
        />
        <InputIconButton
          iconDoubleCheck={!!iconDoubleCheck}
          iconDelete={!!iconDelete}
          iconEyeToggle={!!iconEyeToggle}
          onClickDoubleCheck={onClickDoubleCheck}
          onClickDelete={onClickDelete}
          onClickEye={onClickEye}
          disabledDoubleCheck={disabledDoubleCheck}
        />
      </div>
      <AlertText alertCase={alertCase} />
      <ConfirmText confirmCase={confirmCase} />
    </>
  );
};

const InputFormRef = forwardRef(InputForm);
export default InputFormRef;
