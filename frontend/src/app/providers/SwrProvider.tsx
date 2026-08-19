import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

interface ISwrProviderProps {
  children: ReactNode;
}

/** @description Global SWR config — TV kiosk: no refocus, keep stale data visible */
export const SwrProvider = ({ children }: ISwrProviderProps) => (
  <SWRConfig
    value={{
      revalidateOnFocus: false,
      keepPreviousData: true,
      errorRetryCount: 5,
      errorRetryInterval: 10000,
      dedupingInterval: 5000,
    }}
  >
    {children}
  </SWRConfig>
);
