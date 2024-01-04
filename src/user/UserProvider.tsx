import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSignIn } from '../firebase';

type UserContextProps = {
  isAuthenticated: boolean;
  userId: string | undefined;
  isServerDev: boolean | undefined;
  isSigningIn: boolean;
  selectedAddress?: string;
  addresses?: string[];
  revist?: boolean;
};

const UserContext = createContext<UserContextProps | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const { data, isLoading, error } = useSignIn({ enabled: !signedIn });

  useEffect(() => {
    if (!signedIn && data?.userId) {
      setSignedIn(true);
    }
  }, [data?.userId]);

  useEffect(() => {
    if (error) {
      // show toast or error page
      console.log('check error', error);
    }
  }, [error]);

  const value = useMemo(
    () => ({
      isAuthenticated: signedIn,
      userId: data?.userId,
      isServerDev: data?.isServerDev,
      isSigningIn: isLoading,
    }),
    [signedIn]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
