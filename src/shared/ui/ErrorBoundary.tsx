import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// 애플리케이션에서 발생하는 예기치 않은 오류를 처리하는 컴포넌트
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary에서 오류가 발생했습니다:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div 
          role="alert" 
          className="p-4 bg-red-50 text-red-700 rounded-lg"
          aria-live="assertive"
        >
          <h2 className="font-bold">오류가 발생했습니다</h2>
          <p>페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
          <button 
            onClick={() => {
              this.resetErrorBoundary();
              window.location.reload();
            }}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
