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

type Wallet = {
  address: string;
  name?: string;
};

export function WalletMenu() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);

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
          const wallets: Wallet[] = Object.entries(walletsMap).map(
            ([address, name]) => ({
              address,
              name,
            })
          );

          setWallets(wallets);
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
        {selectedAddress ?? 'Connect Wallet'}
      </MenuButton>
      <MenuList>
        {wallets.map((wallet) => (
          <MenuItem key={wallet.address} minH="48px">
            {wallet.name ?? wallet.address}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
