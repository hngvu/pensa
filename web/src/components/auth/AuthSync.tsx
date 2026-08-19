import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useAtom } from 'jotai';
import { axiosClient } from '../../api/axiosClient';
import { authSyncedAtom } from '../../state/atoms';

export function AuthSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [isSynced, setIsSynced] = useAtom(authSyncedAtom);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !isSynced) {
      const sync = async () => {
        try {
          const token = await getToken();
          const email = user.primaryEmailAddress?.emailAddress || '';
          const fullName = user.fullName || '';
          const avatarUrl = user.imageUrl || '';

          await axiosClient.post('/users/sync', 
            { email, fullName, avatarUrl },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('User synced to backend');
          setIsSynced(true);
        } catch (err) {
          console.error('Failed to sync user', err);
          setIsSynced(true);
        }
      };
      
      sync();
    }
  }, [isLoaded, isSignedIn, user, getToken, isSynced, setIsSynced]);

  return null;
}
