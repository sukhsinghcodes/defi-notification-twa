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
  InputGroup,
  InputRightElement,
  IconButton,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { MainButton } from '../../twa-ui-kit';
import { Wallet } from './types';
import { BiPaste } from 'react-icons/bi';
import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';

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
  const [pasteSupported, setPasteSupported] = useState(false);
  const toast = useToast();

  const form = useFormik({
    initialValues: {
      address: '',
      name: '',
    },
    onSubmit,
  });

  useEffect(() => {
    async function checkPermission() {
      try {
        // const permission = await navigator.permissions.query({
        //   name: 'clipboard-read',
        //   // little hack for TS to ignore this unavailable type
        // } as unknown as PermissionDescriptor);
        // if (permission.state === 'granted') {
        //   setPasteSupported(true);
        //   return;
        // }

        if (typeof navigator.clipboard.readText === 'function') {
          setPasteSupported(true);
        }
      } catch (err) {
        // paste not supported
        console.error(err);
      }
    }
    checkPermission();
  }, []);

  const handlePaste = useCallback(() => {
    async function paste() {
      try {
        const text = await navigator.clipboard.readText();
        form.setFieldValue('address', text);
      } catch (err) {
        toast({
          description: 'Failed to read clipboard contents',
          status: 'error',
          duration: 2000,
        });
      }
    }
    paste();
  }, [form, toast]);

  return (
    <Drawer
      placement="bottom"
      onClose={() => {
        onClose();
        form.resetForm();
      }}
      isOpen={isOpen}
      autoFocus={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Add Wallet</DrawerHeader>
        <DrawerBody>
          <form>
            <VStack spacing={4} mb={4} alignItems="stretch">
              <FormControl isInvalid={Boolean(form.errors.address)}>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="Address"
                    {...form.getFieldProps('address')}
                  />
                  {pasteSupported && (
                    <InputRightElement>
                      <IconButton
                        aria-label="Paste"
                        icon={<Icon as={BiPaste} />}
                        size="sm"
                        variant="ghost"
                        onClick={handlePaste}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
                {Boolean(form.errors.address) && (
                  <FormErrorMessage>
                    Wallet address is required.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Name"
                  {...form.getFieldProps('name')}
                />
              </FormControl>
              <MainButton text="Add" onClick={form.handleSubmit} />
            </VStack>
          </form>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
