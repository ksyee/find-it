import type { ReactNode } from "react";
import Modal from "@/components/common/molecule/Modal";

interface ModalCompProps {
  children: ReactNode;
  confirmText: string;
  onClickConfirm: () => void;
}

const ModalComp = ({ children, confirmText, onClickConfirm }: ModalCompProps) => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#00000045]">
      <Modal
        children={children}
        confirmText={confirmText}
        onClickConfirm={onClickConfirm}
      />
    </div>
  );
};

export default ModalComp;
