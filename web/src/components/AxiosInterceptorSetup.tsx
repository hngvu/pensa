import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { setupAxiosInterceptors } from '../api/axiosClient';

/**
 * A wrapper component that hooks up Clerk's auth token with Axios.
 * Must be placed inside the <ClerkProvider>.
 */
export function AxiosInterceptorSetup({ children }: { children: ReactNode }) {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      setupAxiosInterceptors(getToken);
    }
  }, [getToken, isLoaded]);

  // We can choose to wait until loaded, or just render children.
  // Returning children directly means initial API calls might fire before token is attached
  // if not handled properly, but typically React Query handles retries or we delay rendering.
  return <>{children}</>;
}
