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
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { BiChevronDown, BiPlusCircle } from 'react-icons/bi';
import { StorageKeys } from '../../user';
import { isTwa } from '../../utils';
import Twa from '@twa-dev/sdk';
import { DataDisplayItem, MainButton } from '../../twa-ui-kit';

export function WalletMenu() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Record<string, string>>();

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

  if (selectedAddress && wallets) {
    return (
      <Box>
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
      </Box>
    );
  }

  return <MainButton onClick={() => {}} text="Add Wallet" />;
}
