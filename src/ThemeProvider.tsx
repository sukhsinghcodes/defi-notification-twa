import { ChakraProvider } from '@chakra-ui/react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { theme, altTheme, setTwaBg, setHeaderColor } from './twa-ui-kit/theme';

type ThemeContextProps = {
  theme: any;
  setBg: (theme: 'bg_color' | 'secondary_bg_color') => void;
  setHeaderColor: (color: `#${string}`) => void;
};

const ThemeContext = createContext<ThemeContextProps | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [selectedTheme, setTheme] = useState<'bg_color' | 'secondary_bg_color'>(
    'secondary_bg_color'
  );

  const value = useMemo(
    () => ({
      setBg: (_theme: 'bg_color' | 'secondary_bg_color') => {
        setTheme(_theme);
      },
      theme: selectedTheme,
      setHeaderColor: (color: `#${string}`) => {
        setHeaderColor(color);
      },
    }),
    [setTheme, selectedTheme]
  );

  useEffect(() => {
    setTwaBg(selectedTheme);
  }, [selectedTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ChakraProvider
        theme={selectedTheme === 'secondary_bg_color' ? theme : altTheme}
      >
        {children}
      </ChakraProvider>
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
