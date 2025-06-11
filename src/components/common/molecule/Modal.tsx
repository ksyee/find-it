import { ReactNode } from 'react';
import { JSX } from 'react/jsx-runtime';

interface ModalProps {
  cancelText?: string;
  confirmText: string;
  children: string;
  onClickCancel?: () => void;
  onClickConfirm?: () => void;
}

type CancelButton =
  | string
  | number
  | boolean
  | JSX.Element
  | Iterable<ReactNode>;

const Modal = ({
  cancelText,
  confirmText = '확인',
  children,
  onClickCancel,
  onClickConfirm,
}: ModalProps) => {
  const buttonTextStyle =
    'leading-[21px] text-center font-medium tracking-[-0.48px]';

  let cancelButton: CancelButton | null = null;

  if (cancelText !== undefined) {
    cancelButton = (
      <button
        type="button"
        onClick={onClickCancel}
        className={`${buttonTextStyle} text-gray-700`}
      >
        {cancelText}
      </button>
    );
  }

  return (
    <div className="flex w-[302px] flex-col items-center justify-center gap-[26px] rounded-lg bg-white px-[76px] pt-[46px] pb-[26px]">
      <p className="w-[280px] text-center text-[14px] text-gray-400">
        {children}
      </p>
      <div className="flex h-[21px] w-[150px] items-center justify-center gap-[90px]">
        {cancelButton && cancelButton}
        <button
          type="button"
          onClick={onClickConfirm}
          className={`${buttonTextStyle} text-primary`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
