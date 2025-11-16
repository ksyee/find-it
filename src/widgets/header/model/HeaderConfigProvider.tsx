import { useMemo, useState, type ReactNode } from 'react';
import {
  HeaderConfigContext,
  DEFAULT_HEADER_CONFIG,
  type HeaderConfig
} from './HeaderConfigStore';

interface HeaderConfigProviderProps {
  children: ReactNode;
}

export const HeaderConfigProvider = ({ children }: HeaderConfigProviderProps) => {
  const [config, setConfig] = useState<HeaderConfig>(DEFAULT_HEADER_CONFIG);

  const value = useMemo(() => ({ config, setConfig }), [config]);

  return (
    <HeaderConfigContext.Provider value={value}>
      {children}
    </HeaderConfigContext.Provider>
  );
};

export default HeaderConfigProvider;
