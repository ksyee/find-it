import { useContext } from 'react';
import { RouteProgressContext } from './RouteProgressContext';

export const useRouteProgress = () => useContext(RouteProgressContext);

export default useRouteProgress;
