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

type AddWalletDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddWalletDrawer({ isOpen, onClose }: AddWalletDrawerProps) {
  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Add Wallet</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} mb={4} alignItems="stretch">
            <Input placeholder="Address" />
            <Input placeholder="Name" />
            <MainButton text="Add" onClick={() => {}} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
