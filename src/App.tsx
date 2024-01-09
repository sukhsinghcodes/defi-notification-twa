import { HomePage, ProjectIndex, ProjectPage } from './routes';
import { UserProvider } from './user';
import { useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';
import Twa from '@twa-dev/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import { config } from './web3';
import { ThemeProvider } from './ThemeProvider';
import { NotificationPage } from './routes/project/notification';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/project/:projectId',
    element: <ProjectPage />,
    children: [
      {
        index: true,
        element: <ProjectIndex />,
      },
      {
        path: '/project/:projectId/notification/:notificationId',
        element: <NotificationPage />,
      },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ThemeProvider>
          <ColorMode />
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </ThemeProvider>
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
