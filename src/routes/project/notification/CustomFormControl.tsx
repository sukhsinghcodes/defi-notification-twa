import {
  FormControl,
  FormLabel,
  Input,
  Select,
  VisuallyHiddenInput,
} from '@chakra-ui/react';
import { Control } from '../../../firebase/types';
import { Card } from '../../../twa-ui-kit';
import { CustomNumberInput } from './CustomNumberInput';
import { UseFormRegister } from 'react-hook-form';

type FormControlProps = {
  control: Control;
  register: UseFormRegister<{ [name: string]: string }>;
};

export function CustomFormControl({ control, register }: FormControlProps) {
  let Comp = null;

  switch (control.type) {
    case 'input-text':
    case 'input-address':
      Comp = (
        <Card>
          <FormControl>
            <FormLabel>{control.label}</FormLabel>
            <Input
              {...register(control.id)}
              type="text"
              placeholder={control.label}
              value={control.value || ''}
              defaultValue={control.defaultValue || ''}
            />
          </FormControl>
        </Card>
      );
      break;
    case 'input-select':
      Comp = (
        <Card>
          <FormControl>
            <FormLabel>{control.label}</FormLabel>
            <Select
              {...register(control.id)}
              value={control.value || ''}
              defaultValue={control.defaultValue || ''}
            >
              {control.selectOptions?.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </Select>
          </FormControl>
        </Card>
      );
      break;
    case 'input-number':
      Comp = (
        <Card>
          <FormControl>
            <FormLabel>{control.label}</FormLabel>
            <CustomNumberInput control={control} register={register} />
          </FormControl>
        </Card>
      );
      break;
    case 'hidden':
      Comp = (
        <VisuallyHiddenInput
          {...register(control.id)}
          value={control.value || ''}
          defaultValue={control.defaultValue || ''}
        />
      );
      break;
    default:
      return null;
  }
  return Comp;
}
