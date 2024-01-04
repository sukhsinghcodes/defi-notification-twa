import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSignIn } from './hooks';

type FirebaseContextProps = {
  isAuthenticated: boolean;
  userId: string | undefined;
  isServerDev: boolean | undefined;
  isSigningIn: boolean;
};

const FirebaseContext = createContext<FirebaseContextProps | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const { data, isLoading, error } = useSignIn({ enabled: !signedIn });

  useEffect(() => {
    console.log('check sign in');
    if (!signedIn && data?.userId) {
      setSignedIn(true);
    }
  }, [data?.userId]);

  useEffect(() => {
    console.log('check error');

    if (error) {
      // show toast or error page
    }
  }, [error]);

  console.log('renders');

  const value = useMemo(
    () => ({
      isAuthenticated: signedIn,
      userId: data?.userId,
      isServerDev: data?.isServerDev,
      isSigningIn: isLoading,
    }),
    [signedIn]
  );

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
