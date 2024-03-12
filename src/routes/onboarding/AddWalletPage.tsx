import { Container, Heading, VStack, useToast } from '@chakra-ui/react';

import { AddWalletForm } from '../../components/AddWalletForm';
import { useTheme } from '../../ThemeProvider';
import { useCallback, useEffect } from 'react';
import { BackButton } from '../../twa-ui-kit';
import { StorageKeys } from '../../user';
import { formatAddress } from '../../utils';
import { Wallet } from '../home/types';
import Twa from '@twa-dev/sdk';
import { useNavigate } from 'react-router-dom';

export function AddWalletPage() {
  const { setHeaderColor, setBg } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setHeaderColor('bg_color');
    setBg('bg_color');

    return () => {
      setHeaderColor('secondary_bg_color');
      setBg('secondary_bg_color');
    };
  }, [setBg, setHeaderColor]);

  const addWalletSubmit = useCallback(
    (wallet: Wallet) => {
      try {
        const walletsStr = JSON.stringify([wallet]);
        Twa.CloudStorage.setItem(StorageKeys.ADDRESSES, walletsStr, (err) => {
          if (err) {
            throw err;
          }

          toast({
            title: `${wallet.name} added.`,
            description: formatAddress(wallet.address),
            status: 'success',
            duration: 2000,
          });

          Twa.CloudStorage.setItem(
            StorageKeys.SELECTED_ADDRESS,
            wallet.address,
            (err) => {
              if (err) {
                console.log(err);
                return;
              }

              navigate('/home');
            }
          );
        });
      } catch (err) {
        if (!toast.isActive('add-wallet-error')) {
          toast({
            title: 'Error when adding new wallet',
            status: 'error',
            duration: 2000,
            id: 'add-wallet-error',
          });
        }
      }
    },
    [navigate, toast]
  );

  return (
    <Container>
      <BackButton />
      <VStack spacing={8} mb={8} pt={8} alignItems="stretch">
        <Heading as="h1" size="lg">
          Add your wallet
        </Heading>
        <AddWalletForm onSubmit={addWalletSubmit} />
      </VStack>
    </Container>
  );
}
