import { FC } from 'react';

import { Avatar, Group, Text } from '@mantine/core';

import { IUser } from 'store/slices/auth/types';

type Props = {
  currentMember: IUser;
  handleAdd: (currentMember: IUser) => void;
};

export const SearchResult: FC<Props> = ({ currentMember, handleAdd }: Props) => {
  const { id, nickName, name, image } = currentMember;

  return (
    <Group mb="md" key={id} spacing="sm" onClick={() => handleAdd(currentMember)}>
      <Avatar size={40} src={image} radius={40} alt="user logo" />

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
