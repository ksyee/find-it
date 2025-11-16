import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  RouteProgressContext,
  type RouteProgressContextValue
} from './RouteProgressContext';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const patchHistory = (onNavigate: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const { history } = window;
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  const patchedPushState: History['pushState'] = function patchedPushState(
    this: History,
    ...args
  ) {
    const result = originalPushState.apply(this, args);
    onNavigate();
    return result;
  };

  const patchedReplaceState: History['replaceState'] =
    function patchedReplaceState(this: History, ...args) {
      const result = originalReplaceState.apply(this, args);
      onNavigate();
      return result;
    };

  history.pushState = patchedPushState;
  history.replaceState = patchedReplaceState;

  return () => {
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
  };
};

interface RouteProgressProviderProps {
  children: ReactNode;
}

export const RouteProgressProvider = ({
  children
}: RouteProgressProviderProps) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const incrementTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef(true);
  const pendingCountRef = useRef(0);

  const clearTimers = () => {
    if (incrementTimerRef.current) {
      window.clearInterval(incrementTimerRef.current);
      incrementTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const beginProgress = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsActive(true);
    setProgress((current) => (current === 0 ? 10 : current));

    if (incrementTimerRef.current) {
      return;
    }

    incrementTimerRef.current = window.setInterval(() => {
      setProgress((current) => {
        const next = current + Math.random() * 15;
        return clamp(next, 0, 90);
      });
    }, 200);
  }, []);

  const finishProgress = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    clearTimers();
    setProgress(100);

    hideTimerRef.current = window.setTimeout(() => {
      setIsActive(false);
      setProgress(0);
    }, 250);
  }, []);

  const start = useCallback(() => {
    pendingCountRef.current += 1;
    if (pendingCountRef.current === 1) {
      beginProgress();
    }
  }, [beginProgress]);

  const done = useCallback(() => {
    if (pendingCountRef.current === 0) {
      return;
    }

    pendingCountRef.current -= 1;
    if (pendingCountRef.current === 0) {
      finishProgress();
    }
  }, [finishProgress]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleNavigateStart = () => {
      start();
    };

    const restoreHistory = patchHistory(handleNavigateStart);
    window.addEventListener('popstate', handleNavigateStart);

    return () => {
      restoreHistory();
      window.removeEventListener('popstate', handleNavigateStart);
    };
  }, [start]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    done();
  }, [location.key, done]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const value = useMemo(
    () => ({
      start,
      done,
      isActive,
      progress
    }),
    [start, done, isActive, progress]
  );

  return (
    <RouteProgressContext.Provider value={value}>
      {children}
    </RouteProgressContext.Provider>
  );
};
