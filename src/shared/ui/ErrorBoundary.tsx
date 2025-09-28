import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * 애플리케이션에서 발생하는 예기치 않은 오류를 처리하는 컴포넌트
 * 자식 컴포넌트에서 오류가 발생하면 오류 UI를 표시합니다.
 * React 18과 호환되도록 업데이트되었습니다.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 에러 로깅 서비스에 오류를 기록할 수 있습니다.
    console.error('ErrorBoundary에서 오류가 발생했습니다:', error, errorInfo);
    
    // 사용자 정의 오류 처리 함수가 있으면 호출합니다.
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * 오류 상태를 초기화하는 메서드
   */
  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 사용자 정의 폴백 UI를 렌더링하거나 기본 오류 메시지를 표시합니다.
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
