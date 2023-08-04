import { FC } from 'react';

import { Badge, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { TeamUserItem } from 'components';
import { useAuth } from 'store/store';

export const TeamInfoPanel: FC = () => {
  const { t } = useTranslation();
  const { members, currentTeam } = useAuth((store) => store);

  const getMembersItems = members.map((member) => (
    <TeamUserItem key={member.id} member={member} />
  ));

  return (
    <>
      <div>
        <Group mb={10}>
          <Text fz="xl" fw={700}>
            {t('tournaments.members')}
          </Text>
          <Badge w={22} h={22} variant="filled" size="xs" p={0}>
            {members.length}
          </Badge>
        </Group>
        {getMembersItems}
      </div>

      <div>
        <Text fz="xl" fw={700} mt={20} mb={20}>
          {t('teams.aboutTeam')}
        </Text>
        <Text>{currentTeam?.about}</Text>
      </div>
    </>
  );
};
