import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

import { Avatar, Group, Text } from '@mantine/core';

interface Props extends ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
}

export const SelectItem: FC<Props> = forwardRef<HTMLDivElement, Props>(
  ({ image, label, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  ),
);
