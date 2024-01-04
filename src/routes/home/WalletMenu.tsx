import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { StorageKeys } from '../../user';
import { isTwa } from '../../utils';
import Twa from '@twa-dev/sdk';

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
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={
          <Icon as={selectedAddress && wallets ? BiChevronDown : BiPlus} />
        }
        variant="primary"
      >
        {selectedAddress && wallets
          ? wallets[selectedAddress]
          : 'Connect Wallet'}
      </MenuButton>
      <MenuList>
        {wallets &&
          Object.entries(wallets).map(([address, name]) => (
            <MenuItem
              key={address}
              minH="48px"
              onClick={() => handleSelect(address)}
            >
              {name != '' ? name : address}
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  );
}
