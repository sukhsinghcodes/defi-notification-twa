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

type FormControlProps = {
  control: Control;
};

export function CustomFormControl({ control }: FormControlProps) {
  let Comp = null;

  switch (control.type) {
    case 'input-text':
    case 'input-address':
      Comp = (
        <Card>
          <FormControl>
            <FormLabel>{control.label}</FormLabel>
            <Input
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
            <CustomNumberInput control={control} />
          </FormControl>
        </Card>
      );
      break;
    case 'hidden':
      Comp = (
        <VisuallyHiddenInput
          name={control.id}
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
