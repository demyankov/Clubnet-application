import { FC } from 'react';

import { Flex } from '@mantine/core';

import { MembersList } from 'components/Team/Modal/MembersList/MembersList';
import { Search } from 'components/Team/Search/Search';

export const InviteMemberModal: FC = () => (
  <Flex direction="column" gap="md">
    <Search />
    <MembersList />
  </Flex>
);
