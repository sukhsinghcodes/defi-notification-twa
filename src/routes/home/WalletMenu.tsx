import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { StorageKeys } from '../../user';
import { isTwa } from '../../utils';
import Twa from '@twa-dev/sdk';

export function WalletMenu() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Map<string, string>>(new Map());

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
          const walletsMap = JSON.parse(addressesStr) as Map<string, string>;

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

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<Icon as={BiChevronDown} />}
        variant="primary"
      >
        {selectedAddress ? wallets.get(selectedAddress) : 'Connect Wallet'}
      </MenuButton>
      <MenuList>
        {Array.from(wallets.entries()).map(([address, name]) => (
          <MenuItem key={address} minH="48px">
            {name != '' ? name : address}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
