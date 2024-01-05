import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  VStack,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { MainButton } from '../../twa-ui-kit';
import { Wallet } from './types';
import { useForm } from 'react-hook-form';

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
  const form = useForm({
    defaultValues: {
      address: '',
      name: '',
    },
  });

  return (
    <Drawer
      placement="bottom"
      onClose={() => {
        onClose();
        form.reset();
      }}
      isOpen={isOpen}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Add Wallet</DrawerHeader>
        <DrawerBody>
          <form>
            <VStack spacing={4} mb={4} alignItems="stretch">
              <FormControl isInvalid={Boolean(form.formState.errors.address)}>
                <Input
                  type="text"
                  placeholder="Address"
                  {...form.register('address', { required: true })}
                />
                {Boolean(form.formState.errors.address) && (
                  <FormErrorMessage>
                    Wallet address is required.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Name"
                  {...form.register('name')}
                />
              </FormControl>
              <MainButton text="Add" onClick={form.handleSubmit(onSubmit)} />
            </VStack>
          </form>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
