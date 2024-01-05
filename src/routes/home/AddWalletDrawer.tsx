import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  VStack,
} from '@chakra-ui/react';
import { MainButton } from '../../twa-ui-kit';
import { useState } from 'react';
import { Wallet } from './types';

type AddWalletDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wallet: Wallet) => void;
};

export function AddWalletDrawer({
  isOpen,
  onClose,
  onSubmit,
}: AddWalletDrawerProps) {
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Add Wallet</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} mb={4} alignItems="stretch">
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <MainButton
              text="Add"
              onClick={() => onSubmit({ address, name })}
            />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
