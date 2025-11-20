import React, { PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { initApp } from '@/providers/app-init.util';
import type { AppDispatch } from './store';

export const AppInitializer: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsub = initApp(dispatch);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [dispatch]);

  return <>{children}</>;
};
