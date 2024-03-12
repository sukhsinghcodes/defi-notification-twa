import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import { Wallet } from '../routes/home/types';
import { AddWalletForm } from './AddWalletForm';

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
  return (
    <Drawer
      placement="bottom"
      onClose={() => {
        onClose();
      }}
      isOpen={isOpen}
      autoFocus={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Add Wallet</DrawerHeader>
        <DrawerBody>
          <AddWalletForm onSubmit={onSubmit} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
