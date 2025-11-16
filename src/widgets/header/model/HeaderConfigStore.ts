import { createContext } from 'react';
import type { HeaderProps } from '@/widgets/header/ui/Header';

export interface HeaderConfig extends HeaderProps {
  visible: boolean;
}

export const DEFAULT_HEADER_CONFIG: HeaderConfig = { visible: false };

interface HeaderContextValue {
  config: HeaderConfig;
  setConfig: (next: HeaderConfig) => void;
}

export const HeaderConfigContext = createContext<HeaderContextValue>({
  config: DEFAULT_HEADER_CONFIG,
  setConfig: () => {}
});
