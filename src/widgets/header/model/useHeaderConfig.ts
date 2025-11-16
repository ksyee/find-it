import { useContext, useEffect, type DependencyList } from 'react';
import type { HeaderProps } from '@/widgets/header/ui/Header';
import {
  HeaderConfigContext,
  DEFAULT_HEADER_CONFIG
} from './HeaderConfigStore';

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
