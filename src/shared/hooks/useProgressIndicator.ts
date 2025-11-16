import { useEffect, useRef } from 'react';
import { useRouteProgress } from '@/shared/ui/progress/RouteProgressProvider';

export const useProgressIndicator = (active: boolean) => {
  const { start, done } = useRouteProgress();
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (active && !wasActiveRef.current) {
      start();
      wasActiveRef.current = true;
    } else if (!active && wasActiveRef.current) {
      done();
      wasActiveRef.current = false;
    }

    return () => {
      if (wasActiveRef.current) {
        done();
        wasActiveRef.current = false;
      }
    };
  }, [active, start, done]);
};
