import { getAuth, signInAnonymously } from 'firebase/auth';
import { ref, get, child, set } from 'firebase/database';
import { database } from '../../firebase-config';
import { useQuery } from '@tanstack/react-query';

export function useSignIn({ enabled = true }) {
  return useQuery({
    queryKey: ['signIn'],
    queryFn: async () => {
      try {
        const auth = getAuth();
        const { user } = await signInAnonymously(auth);
        const userRef = ref(database, `users/${user.uid}`);
        const userSnapshot = await get(userRef);

        if (!userSnapshot.exists()) {
          throw new Error('No user data available');
        }

        const settings = await get(child(userRef, 'settings'));

        const isServerDev = Boolean(settings.val().isServerDev);

        const lastLogon = new Date().getTime();
        await set(child(userRef, 'lastLogon'), lastLogon);

        return {
          userId: user.uid,
          isServerDev,
          lastLogon,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    enabled,
  });
}
