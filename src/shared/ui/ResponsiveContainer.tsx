import { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * 반응형 컨테이너 컴포넌트
 * - 모바일: 375px 고정
 * - 태블릿: 768px max
 * - 데스크탑: 1280px max
 */
const ResponsiveContainer = ({
  children,
  className = ''
}: ResponsiveContainerProps) => {
  return (
    <div
      className={`mx-auto w-full max-w-[375px] md:max-w-[768px] lg:max-w-[1280px] ${className}`}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
