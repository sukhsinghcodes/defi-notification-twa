import {
  useNumberInput,
  HStack,
  Input,
  IconButton,
  Icon,
  NumberInputProps,
} from '@chakra-ui/react';
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi';

export function CustomNumberInput(props: NumberInputProps) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput(props);

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
      <Input {...input} />
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
