import { FC, SVGProps } from 'react';

import { Grid, Group, Text } from '@mantine/core';

type Props = {
  title: string;
  text?: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
};

export const TournamentsInfoItem: FC<Props> = ({ title, text, Icon }) => {
  return (
    <Grid.Col xs={6} sm={4}>
      <Group noWrap>
        <Icon />
        <div>
          <Text c="dimmed" tt="uppercase" fz="sm">
            {title}
          </Text>
          <Text fw={700} fz="xs">
            {text}
          </Text>
        </div>
      </Group>
    </Grid.Col>
  );
};
