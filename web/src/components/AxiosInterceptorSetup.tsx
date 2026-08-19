import { useAuth } from '@clerk/clerk-react';
import { useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import { setupAxiosInterceptors } from '../api/axiosClient';

/**
 * A wrapper component that hooks up Clerk's auth token with Axios.
 * Must be placed inside the <ClerkProvider>.
 */
export function AxiosInterceptorSetup({ children }: { children: ReactNode }) {
  const { getToken, isLoaded } = useAuth();

  useLayoutEffect(() => {
    if (isLoaded) {
      setupAxiosInterceptors(getToken);
    }
  }, [getToken, isLoaded]);

  if (!isLoaded) return null;

  return <>{children}</>;
}
