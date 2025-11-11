import { useEffect, useState } from 'react';
import ErrorBoundary from '@/shared/ui/ErrorBoundary';
import { Splash } from '@/pages';
import AppProviders from '@/app/providers/AppProviders';
import AppRouter from '@/app/router/AppRouter';

const SPLASH_KEY = 'alreadyVisited';

const errorFallback = (
  <div className="flex min-h-screen flex-col items-center justify-center rounded-lg bg-red-50 p-4 text-center text-red-700">
    <h2 className="mb-2 text-xl font-extrabold">앱에서 오류가 발생했습니다</h2>
    <p className="mb-4">
      예기치 않은 문제가 발생했습니다. 페이지를 새로고침해 주세요.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="rounded bg-red-100 px-4 py-2 transition-colors hover:bg-red-200"
    >
      새로고침
    </button>
  </div>
);

const getInitialSplashState = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    const alreadyVisited = JSON.parse(
      window.localStorage.getItem(SPLASH_KEY) || 'false'
    );
    return !alreadyVisited;
  } catch (error) {
    console.warn('Failed to read splash state from localStorage', error);
    return true;
  }
};

const App = () => {
  const [showSplash, setShowSplash] = useState(getInitialSplashState);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (typeof window === 'undefined') {
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }

    if (showSplash) {
      timeout = window.setTimeout(() => {
        setShowSplash(false);
        try {
          window.localStorage.setItem(SPLASH_KEY, JSON.stringify(true));
        } catch (error) {
          console.warn('Failed to persist splash state', error);
        }
      }, 3500);
    }

    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [showSplash]);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <ErrorBoundary fallback={errorFallback}>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
