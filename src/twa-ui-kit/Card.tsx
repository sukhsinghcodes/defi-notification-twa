import { CardBody, Card as ChakraCard } from '@chakra-ui/react';
import { SerializedStyles, css } from '@emotion/react';

import { colors } from './theme';

const styles = {
  base: css`
    border-radius: 0.875rem;
    width: 100%;
    box-shadow: unset;
    background-color: ${colors.bg_color};
    color: ${colors.text_color};
  `,
  clickable: css`
    cursor: pointer;
    user-select: none;
  `,
};

type CardProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  css?: (SerializedStyles | undefined)[];
};

export function Card({ children, onClick, className = '', css }: CardProps) {
  return (
    <ChakraCard
      onClick={onClick}
      size="sm"
      css={[styles.base, ...(onClick ? [styles.clickable] : []), css]}
      className={className}
    >
      <CardBody>{children}</CardBody>
    </ChakraCard>
  );
}
