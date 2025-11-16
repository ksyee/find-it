import * as React from 'react';

export interface IconDoubleCheckProps {
  color?: string;
  className?: string;
}

// 중복확인 텍스트를 아이콘 형태로 렌더링하는 컴포넌트
const IconDoubleCheck: React.FC<IconDoubleCheckProps> = ({
  color = 'black',
  className = '',
}) => {
  return (
    <span
      className={`whitespace-nowrap text-[10px] leading-8 ${className}`}
      style={{ color }}
    >
      중복확인
    </span>
  );
};

export default IconDoubleCheck;
