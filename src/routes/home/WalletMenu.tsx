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
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { BiChevronDown, BiPlusCircle } from 'react-icons/bi';
import { StorageKeys } from '../../user';
import { isTwa } from '../../utils';
import Twa from '@twa-dev/sdk';
import { DataDisplayItem, MainButton } from '../../twa-ui-kit';
import { AddWalletDrawer } from './AddWalletDrawer';

type Wallet = {
  address: string;
  name?: string;
};

export function WalletMenu() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Record<string, string>>({});
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);

  useEffect(() => {
    if (isTwa) {
      try {
        Twa.CloudStorage.getItem(StorageKeys.ADDRESSES, (err, addressesStr) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!addressesStr) {
            return;
          }

          console.log('addressesStr', addressesStr);
          const walletsMap = JSON.parse(addressesStr) as Record<string, string>;

          console.log('walletsMap', walletsMap);

          setWallets(walletsMap);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    if (isTwa) {
      try {
        Twa.CloudStorage.getItem(
          StorageKeys.SELECTED_ADDRESS,
          (err, address) => {
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

            console.log('address', address);

            setSelectedAddress(address);
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const handleSelect = useCallback((address: string) => {
    if (isTwa) {
      try {
        Twa.CloudStorage.setItem(
          StorageKeys.SELECTED_ADDRESS,
          address,
          (err) => {
            if (err) {
              console.log(err);
              return;
            }

            console.log('address set');
            setSelectedAddress(address);
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const addWallet = useCallback(
    (wallet: Wallet) => {
      if (isTwa) {
        setWallets((w) => {
          w[wallet.address] = wallet.name || '';

          try {
            const walletsStr = JSON.stringify(w);
            Twa.CloudStorage.setItem(
              StorageKeys.ADDRESSES,
              walletsStr,
              (err) => {
                if (err) {
                  throw err;
                }
              }
            );
          } catch (err) {
            console.log(err);
          }

          return w;
        });
      }
    },
    [wallets]
  );

  return (
    <Box>
      {selectedAddress && wallets ? (
        <Menu>
          <MenuButton as={Button} variant="card">
            <DataDisplayItem
              StartTextSlot={
                <Heading as="h3" variant="bodyTitle">
                  {wallets[selectedAddress]}
                </Heading>
              }
              EndIconSlot={<Icon as={BiChevronDown} />}
            />
          </MenuButton>
          <MenuList>
            {wallets &&
              Object.entries(wallets).map(([address, name]) => (
                <MenuItem key={address} onClick={() => handleSelect(address)}>
                  {name != '' ? name : address}
                </MenuItem>
              ))}
            <MenuDivider />
            <MenuItem onClick={() => {}} icon={<Icon as={BiPlusCircle} />}>
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
      />
    </Box>
  );
}
