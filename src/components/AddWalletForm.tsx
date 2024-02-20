import {
  useToast,
  VStack,
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Icon,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import { BiPaste } from 'react-icons/bi';
import { MainButton } from '../twa-ui-kit';
import { Wallet } from '../routes/home/types';

type AddWalletFormProps = {
  onSubmit: (wallet: Wallet) => void;
};

export function AddWalletForm({ onSubmit }: AddWalletFormProps) {
  const [pasteSupported, setPasteSupported] = useState(false);
  const toast = useToast();

  const form = useFormik({
    initialValues: {
      address: '',
      name: '',
    },
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      if (!values.address) {
        errors.address = 'Wallet address is required';
      }

      if (!values.name) {
        errors.name = 'Name is required';
      }

      return errors;
    },
    onSubmit: (values) => {
      onSubmit(values);
      form.resetForm();
    },
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
    <form>
      <VStack spacing={4} mb={4} alignItems="stretch">
        <FormControl isInvalid={Boolean(form.errors.address)}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Address"
              required
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
            <FormErrorMessage>{form.errors.address}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={Boolean(form.errors.address)}>
          <Input
            type="text"
            placeholder="Name"
            required
            {...form.getFieldProps('name')}
          />
          {Boolean(form.errors.name) && (
            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
          )}
        </FormControl>
        <MainButton text="Add" onClick={form.submitForm} />
      </VStack>
    </form>
  );
}
