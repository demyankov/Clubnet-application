import React, { FC } from 'react';

import { Avatar, Group, Text } from '@mantine/core';
import { generatePath, useNavigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { IUser } from 'store/slices/auth/types';

type Props = {
  client: IUser;
};

export const SearchClient: FC<Props> = ({ client: { id, nickName, name, image } }) => {
  const navigate = useNavigate();

  const handleUser = (): void => {
    navigate(generatePath(`${Paths.player}/:nickname`, { nickname: nickName }));
  };

  return (
    <Group mb="md" key={id} spacing="sm" onClick={handleUser}>
      <Avatar size={40} src={image} radius={40} />

      <div>
        <Text fz="sm" fw={500}>
          {nickName}
        </Text>

        <Text fz="xs" c="dimmed">
          {name}
        </Text>
      </div>
    </Group>
  );
};
