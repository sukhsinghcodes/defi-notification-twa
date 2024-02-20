import { Container, Heading, Image, Spinner, VStack } from '@chakra-ui/react';
import { StorageKeys, useUser } from '../../user';
import { useEffect } from 'react';
import Twa from '@twa-dev/sdk';
import { MainButton } from '../../twa-ui-kit';
import { useNavigate } from 'react-router-dom';

export function OnboardingPage() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuthenticated) {
      try {
        Twa.CloudStorage.getItem(StorageKeys.REVISIT, (err, revisit) => {
          if (err) {
            console.log(err);
            return;
          }

          if (revisit) {
            // redirect to home
            navigate('/home');
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [navigate, user.isAuthenticated]);

  if (user.isSigningIn) {
    return (
      <Container>
        <VStack
          justifyContent={'center'}
          alignItems={'center'}
          height={'100vh'}
        >
          <Spinner />
        </VStack>
      </Container>
    );
  }

  return (
    <Container>
      <VStack spacing={8} mb={8} pt={8}>
        <Image
          src="/defi_icon.svg"
          alt="DeFi Notifications Logo"
          width="60px"
        />
        <Heading as="h1" size="md" textAlign="center">
          Welcome to the DeFi Notifications Telegram bot!
        </Heading>
        <MainButton
          onClick={() => {
            navigate('/home');
          }}
          text="Connect your wallet"
        />
      </VStack>
    </Container>
  );
}
