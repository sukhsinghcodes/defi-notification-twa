import { Home } from './routes';
import { UserProvider } from './user';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';
import { theme } from './theme';
import Twa from '@twa-dev/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import { config } from './web3';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ChakraProvider theme={theme}>
          <ColorMode />
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </ChakraProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

const ColorMode = () => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(Twa.colorScheme);
  }, [setColorMode]);

  return null;
};
