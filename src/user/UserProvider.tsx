import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSignIn } from '../firebase';
import Twa from '@twa-dev/sdk';

type TelegramUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  languageCode: string;
};

type UserContextProps = {
  isAuthenticated: boolean;
  userId: string | undefined;
  isServerDev: boolean | undefined;
  isSigningIn: boolean;
  telegramUser: TelegramUser | null;
  selectedAddress: string | null;
  setSelectedAddress: (address: string | null) => void;
};

const UserContext = createContext<UserContextProps | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const { data, isLoading, error } = useSignIn({ enabled: !signedIn });
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (signedIn || !data?.userId) {
      return;
    }

    try {
      const tgUserJson = new URLSearchParams(Twa.initData).get('user');

      if (!tgUserJson) {
        throw new Error('No telegram user found');
      }

      setTelegramUser(JSON.parse(tgUserJson));
    } catch (err) {
      console.log(err);
    }

    setSignedIn(true);
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
      telegramUser,
      selectedAddress,
      setSelectedAddress,
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
