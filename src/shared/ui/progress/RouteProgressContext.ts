import { createContext } from 'react';

export interface RouteProgressContextValue {
  start: () => void;
  done: () => void;
  isActive: boolean;
  progress: number;
}

export const RouteProgressContext = createContext<RouteProgressContextValue>({
  start: () => {},
  done: () => {},
  isActive: false,
  progress: 0
});
