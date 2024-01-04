import { css, SerializedStyles } from '@emotion/react';
import { DataDisplayItem } from './DataDisplayItem';
import { Icon, useColorMode } from '@chakra-ui/react';
import { BiCheck } from 'react-icons/bi';

import { colors, tgColors } from '../theme';
import { Card } from './Card';

const styles = css`
  width: 100%;
  color: ${colors.text_color};
  min-height: unset;
  &:last-child:after {
    display: none;
  }
`;

type ListItemProps = {
  StartTextSlot?: React.ReactNode;
  EndTextSlot?: React.ReactNode;
  StartIconSlot?: React.ReactNode;
  EndIconSlot?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  css?: SerializedStyles | undefined;
  dataDisplayItemCss?: SerializedStyles | undefined;
};

export function ListItem({
  StartIconSlot,
  StartTextSlot,
  EndTextSlot,
  EndIconSlot,
  selected,
  onClick,
  css,
  dataDisplayItemCss,
}: ListItemProps) {
  const mode = useColorMode();

  return (
    <Card css={[styles, css]} onClick={onClick}>
      <DataDisplayItem
        css={dataDisplayItemCss}
        StartIconSlot={StartIconSlot}
        StartTextSlot={StartTextSlot}
        EndTextSlot={
          selected ? (
            <Icon as={BiCheck} color={tgColors[mode.colorMode].button_color} />
          ) : (
            EndTextSlot
          )
        }
        EndIconSlot={EndIconSlot}
      />
    </Card>
  );
}
