import {
  useNumberInput,
  HStack,
  Input,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { Control } from '../../../firebase/types';
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi';
import { UseFormRegister } from 'react-hook-form';

type CustomNumberInputProps = {
  control: Control;
  register: UseFormRegister<{ [name: string]: string }>;
};

export function CustomNumberInput({
  control,
  register,
}: CustomNumberInputProps) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: control.defaultValue || 0,
      min: 0,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack>
      <IconButton
        {...dec}
        aria-label="decrement"
        size="md"
        flexGrow={0}
        flexShrink={2}
        icon={<Icon as={BiMinusCircle} />}
      />
      <Input {...register(control.id)} {...input} />
      <IconButton
        {...inc}
        aria-label="increment"
        size="md"
        flexGrow={0}
        flexShrink={2}
        icon={<Icon as={BiPlusCircle} />}
      />
    </HStack>
  );
}
