import * as React from 'react';
import { forwardRef, useState } from 'react';
import AlertText, { AlertCase } from '@/components/atoms/AlertText';
import ConfirmText, { ConfirmCase } from '@/components/atoms/ConfirmText';
import InputIconButton from '@/components/molecules/InputIconButton';

export interface InputFormSlimProps {
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
  className?: string;
}

const InputFormSlim: React.ForwardRefRenderFunction<HTMLInputElement, InputFormSlimProps> = (
  {
    type = 'text',
    title,
    placeholder,
    value,
    alertCase = '',
    confirmCase = '',
    onChange,
    iconDoubleCheck = false,
    iconDelete = false,
    iconEyeToggle = false,
    onClickDoubleCheck,
    onClickDelete,
    onClickEye,
    disabledDoubleCheck = false,
    className = '',
    ...resProps
  }: InputFormSlimProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  // 인풋 접근시 색상 변경, 포커스 아웃 효과
  const [isFocus, setIsFocus] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && typeof ref === 'object' && ref?.current) {
      ref.current.blur();
    }
  };

  const handleFocus = () => setIsFocus(true);
  const handleBlur = () => setIsFocus(false);

  const defaultColor = '#f5f5f5';
  const activeColor = '#4785ff';
  const borderColor = isFocus ? activeColor : defaultColor;

  return (
    <>
      <div
        className={`flex h-[36px] w-full items-center justify-between bg-gray-100 ${className}`}
        style={{ borderBottom: `1.5px solid ${borderColor}` }}
      >
        <label className="sr-only" htmlFor={title}>
          {title}
        </label>
        <input
          className="w-full bg-gray-100 pl-2.5 pr-2.5 text-[12px] text-black"
          style={{ outline: 'none' }}
          ref={ref}
          id={title}
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

export default forwardRef(InputFormSlim);
