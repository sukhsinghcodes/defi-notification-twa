import { Home } from './routes/Home';
import { FirebaseProvider } from './providers';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';
import { theme } from './theme';
import Twa from '@twa-dev/sdk';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
]);

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorMode />
      <FirebaseProvider>
        <RouterProvider router={router} />
      </FirebaseProvider>
    </ChakraProvider>
  );
}

const ColorMode = () => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(Twa.colorScheme);
  }, [setColorMode]);

  return null;
};
