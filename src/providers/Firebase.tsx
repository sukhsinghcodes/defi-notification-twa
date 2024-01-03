import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { child, get, ref } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { database } from '../firebase-config';

type FirebaseContextProps = {
  isAuthenticated: boolean;
};

const FirebaseContext = createContext<FirebaseContextProps | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    async function signIn() {
      try {
        const auth = getAuth();
        const { user } = await signInAnonymously(auth);
        const userRef = ref(database, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          console.log(userSnapshot.val());
        } else {
          console.log('No user data available');
        }

        const settings = await get(child(userRef, 'settings'));
        console.log(settings.val());

        setSignedIn(true);
      } catch (err) {
        console.log(err);
      }
    }

    if (!signedIn) {
      signIn();
    }
  }, []);

  const value = useMemo(() => ({ isAuthenticated: signedIn }), [signedIn]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);

  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }

  return context;
}
