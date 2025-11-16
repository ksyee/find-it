import { ReactNode } from 'react';
import { useProgressIndicator } from '@/shared/hooks/useProgressIndicator';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  loadingFallback: ReactNode;
  errorFallback?: ReactNode;
  children: ReactNode;
}

const DEFAULT_ERROR = (
  <div className="py-10 text-center text-sm text-red-600">
    데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.
  </div>
);

const QueryState = ({
  isLoading,
  isError,
  loadingFallback,
  errorFallback,
  children
}: QueryStateProps) => {
  useProgressIndicator(isLoading);

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (isError) {
    return <>{errorFallback ?? DEFAULT_ERROR}</>;
  }

  return <>{children}</>;
};

export default QueryState;
