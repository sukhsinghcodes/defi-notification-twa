import { ChakraProvider } from '@chakra-ui/react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { theme, altTheme, setTwaBg } from './twa-ui-kit/theme';

type ThemeContextProps = {
  theme: any;
  setBg: (theme: 'bg_color' | 'secondary_bg_color') => void;
};

const ThemeContext = createContext<ThemeContextProps | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [selectedTheme, setTheme] = useState<any>(theme);

  const value = useMemo(
    () => ({
      setBg: (_theme: 'bg_color' | 'secondary_bg_color') => {
        setTwaBg(_theme);
        setTheme(_theme === 'secondary_bg_color' ? theme : altTheme);
      },
      theme: selectedTheme,
    }),
    [setTheme, selectedTheme]
  );

  useEffect(() => {
    setTwaBg('secondary_bg_color');
  }, []);

  return (
    <ThemeContext.Provider value={value}>
      <ChakraProvider theme={selectedTheme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
