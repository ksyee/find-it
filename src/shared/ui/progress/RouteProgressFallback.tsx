import { useEffect } from 'react';
import { useRouteProgress } from './useRouteProgress';

const RouteProgressFallback = () => {
  const { start, done } = useRouteProgress();

  useEffect(() => {
    start();
    return () => {
      done();
    };
  }, [start, done]);

  return null;
};

export default RouteProgressFallback;
