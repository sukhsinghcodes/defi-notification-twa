import {
  Icon,
  Box,
  Heading,
  useToast,
  Text,
  HStack,
  Avatar,
  Divider,
  useDisclosure,
  useOutsideClick,
  SlideFade,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BiChevronDown, BiChevronUp, BiPlusCircle } from 'react-icons/bi';
import { MdCircle } from 'react-icons/md';
import { StorageKeys, useUser } from '../user';
import Twa from '@twa-dev/sdk';
import {
  Card,
  DataDisplayItem,
  List,
  ListItem,
  MainButton,
} from '../twa-ui-kit';
import { AddWalletDrawer } from './AddWalletDrawer';
import { Wallet } from '../routes/home/types';
import { formatAddress } from '../utils';
import { IoWalletOutline } from 'react-icons/io5';
import { css } from '@emotion/react';

const dropdownStyles = css`
  position: absolute;
  z-index: 100;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
`;

export function WalletMenu() {
  const { selectedAddress, setSelectedAddress } = useUser();
  const [wallets, setWallets] = useState<Record<string, string>>({});
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const toast = useToast();
  const { onToggle, onClose, isOpen } = useDisclosure();
  const ref = useRef(null);
  useOutsideClick({
    ref,
    handler: onClose,
  });

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
  }, [setSelectedAddress, wallets]);

  const handleSelect = useCallback(
    (address: string) => {
      try {
        Twa.CloudStorage.setItem(
          StorageKeys.SELECTED_ADDRESS,
          address,
          (err) => {
            if (err) {
              console.log(err);
              return;
            }

            setSelectedAddress(address);
          }
        );
      } catch (err) {
        console.log(err);
      }
    },
    [setSelectedAddress]
  );

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
              description: formatAddress(wallet.address),
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
    [setSelectedAddress, toast]
  );

  return (
    <Box>
      {selectedAddress && wallets ? (
        <div ref={ref} style={{ position: 'relative' }}>
          <Card onClick={onToggle}>
            <DataDisplayItem
              StartIconSlot={
                <Avatar
                  backgroundColor="orange"
                  icon={<Icon as={IoWalletOutline} color={'white'} />}
                />
              }
              StartTextSlot={
                <HStack alignItems="baseline">
                  <Heading as="h3" variant="bodyTitle">
                    {wallets[selectedAddress]}
                  </Heading>
                  <Text variant="hint">{formatAddress(selectedAddress)}</Text>
                </HStack>
              }
              EndIconSlot={<Icon as={isOpen ? BiChevronUp : BiChevronDown} />}
            />
          </Card>

          {isOpen && (
            <Box css={dropdownStyles}>
              <SlideFade in={isOpen} offsetY={-10}>
                <List mode="select">
                  <ListItem
                    onClick={() => {
                      setIsAddWalletOpen(true);
                      onClose();
                    }}
                    EndIconSlot={<Icon as={BiPlusCircle} />}
                    StartTextSlot={<Text as="p">Add Wallet</Text>}
                  />
                  <Divider />
                  {wallets &&
                    Object.entries(wallets).map(([address, name]) => (
                      <ListItem
                        key={address}
                        onClick={() => {
                          handleSelect(address);
                          onClose();
                        }}
                        StartIconSlot={
                          <Icon
                            as={MdCircle}
                            color={
                              address === selectedAddress ? 'green' : 'gray'
                            }
                          />
                        }
                        StartTextSlot={
                          <Box>
                            <Heading as="h3" variant="bodyTitle">
                              {name != '' ? name : formatAddress(address)}
                            </Heading>
                            <Text variant="hint" wordBreak="break-all">
                              {address}
                            </Text>
                          </Box>
                        }
                      />
                    ))}
                </List>
              </SlideFade>
            </Box>
          )}
        </div>
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
