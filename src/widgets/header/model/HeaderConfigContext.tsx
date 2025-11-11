import { createContext, useContext, useEffect, useMemo, useState, type DependencyList, type ReactNode } from 'react';
import type { HeaderProps } from '@/widgets/header/ui/Header';

export interface HeaderConfig extends HeaderProps {
  visible: boolean;
}

export const DEFAULT_HEADER_CONFIG: HeaderConfig = { visible: false };

interface HeaderContextValue {
  config: HeaderConfig;
  setConfig: (next: HeaderConfig) => void;
}

const HeaderConfigContext = createContext<HeaderContextValue>({
  config: DEFAULT_HEADER_CONFIG,
  setConfig: () => {}
});

export const HeaderConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<HeaderConfig>(DEFAULT_HEADER_CONFIG);

  const value = useMemo(() => ({ config, setConfig }), [config]);

  return (
    <HeaderConfigContext.Provider value={value}>
      {children}
    </HeaderConfigContext.Provider>
  );
};

export const useHeaderContext = () => useContext(HeaderConfigContext);

export const useHeaderState = () => useHeaderContext().config;

export const useHeaderConfig = (
  buildConfig: () => HeaderProps | null,
  deps: DependencyList = []
) => {
  const { setConfig } = useHeaderContext();

  useEffect(() => {
    const computed = buildConfig();
    if (computed) {
      setConfig({ visible: true, ...computed });
    } else {
      setConfig(DEFAULT_HEADER_CONFIG);
    }

    return () => {
      setConfig(DEFAULT_HEADER_CONFIG);
    };
  }, [setConfig, ...deps]);
};
