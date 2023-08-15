import { FC } from 'react';

import { Avatar, Flex, Text } from '@mantine/core';

import { BalanceWithIcon } from 'components/shared';
import { IUser } from 'store/slices/auth/types';

type Props = {
  user: IUser;
};

export const ConfirmUser: FC<Props> = ({
  user: { image, name, phone, nickName, balance },
}) => {
  return (
    <Flex justify="space-between" gap={10} align="center">
      <Flex justify="space-between" gap={10}>
        <Avatar src={image} radius="xl" />
        <Flex direction="column">
          <Text size="sm" weight={500}>
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            {nickName}
          </Text>
        </Flex>
      </Flex>

      <Flex direction="column" justify="center" gap={10}>
        <BalanceWithIcon balance={balance} />
        <Text color="dimmed" size="xs">
          {phone}
        </Text>
      </Flex>
    </Flex>
  );
};
