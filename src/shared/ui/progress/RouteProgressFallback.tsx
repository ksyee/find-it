import { useEffect } from 'react';
import { useRouteProgress } from './RouteProgressProvider';

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
