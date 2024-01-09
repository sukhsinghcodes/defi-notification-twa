import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  Box,
  Heading,
  MenuDivider,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { BiChevronDown, BiPlusCircle } from 'react-icons/bi';
import { MdCircle } from 'react-icons/md';
import { StorageKeys, useUser } from '../../user';
import Twa from '@twa-dev/sdk';
import { DataDisplayItem, MainButton } from '../../twa-ui-kit';
import { AddWalletDrawer } from './AddWalletDrawer';
import { Wallet } from './types';
import { formatAddress } from '../../utils';

export function WalletMenu() {
  const { selectedAddress, setSelectedAddress } = useUser();
  const [wallets, setWallets] = useState<Record<string, string>>({});
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    try {
      Twa.CloudStorage.getItem(StorageKeys.ADDRESSES, (err, addressesStr) => {
        if (err) {
          console.log(err);
          return;
        }

        if (!addressesStr) {
          return;
        }

        const walletsMap = JSON.parse(addressesStr) as Record<string, string>;

        setWallets(walletsMap);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    try {
      Twa.CloudStorage.getItem(StorageKeys.SELECTED_ADDRESS, (err, address) => {
        if (err) {
          console.log(err);
          return;
        }

        if (!address && wallets) {
          setSelectedAddress(Object.keys(wallets)[0]);
          return;
        }

        if (!address) {
          return;
        }

        setSelectedAddress(address);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleSelect = useCallback((address: string) => {
    try {
      Twa.CloudStorage.setItem(StorageKeys.SELECTED_ADDRESS, address, (err) => {
        if (err) {
          console.log(err);
          return;
        }

        setSelectedAddress(address);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log('selectedAddress', selectedAddress);
  console.log('wallets', wallets);

  const addWalletSubmit = useCallback(
    (wallet: Wallet) => {
      setWallets((_wallets) => {
        _wallets[wallet.address] = wallet.name || '';

        try {
          const walletsStr = JSON.stringify(_wallets);
          Twa.CloudStorage.setItem(StorageKeys.ADDRESSES, walletsStr, (err) => {
            if (err) {
              throw err;
            }

            setSelectedAddress(wallet.address);
            setIsAddWalletOpen(false);
            toast({
              title: `${wallet.name} added.`,
              description: wallet.address,
              status: 'success',
              duration: 2000,
            });
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

        return _wallets;
      });
    },
    [wallets]
  );

  return (
    <Box>
      {selectedAddress && wallets ? (
        <Menu>
          <MenuButton as={Button} variant="card" py={8}>
            <DataDisplayItem
              StartIconSlot={<Icon as={MdCircle} color={'green'} />}
              StartTextSlot={
                <Box textAlign="left">
                  <Heading as="h3" variant="bodyTitle">
                    {wallets[selectedAddress]}
                  </Heading>
                  <Text variant="hint">{formatAddress(selectedAddress)}</Text>
                </Box>
              }
              EndIconSlot={<Icon as={BiChevronDown} />}
            />
          </MenuButton>
          <MenuList>
            {wallets &&
              Object.entries(wallets).map(([address, name]) => (
                <MenuItem key={address} onClick={() => handleSelect(address)}>
                  <DataDisplayItem
                    StartIconSlot={
                      <Icon
                        as={MdCircle}
                        color={address === selectedAddress ? 'green' : 'gray'}
                      />
                    }
                    StartTextSlot={
                      <Box>
                        <Heading as="h3" variant="bodyTitle">
                          {name != '' ? name : formatAddress(address)}
                        </Heading>
                        <Text variant="hint">{formatAddress(address)}</Text>
                      </Box>
                    }
                  />
                </MenuItem>
              ))}
            <MenuDivider />
            <MenuItem
              onClick={() => setIsAddWalletOpen(true)}
              icon={<Icon as={BiPlusCircle} />}
            >
              Add Wallet
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <MainButton
          onClick={() => setIsAddWalletOpen(true)}
          text="Add Wallet"
        />
      )}

      <AddWalletDrawer
        isOpen={isAddWalletOpen}
        onClose={() => setIsAddWalletOpen(false)}
        onSubmit={addWalletSubmit}
      />
    </Box>
  );
}
