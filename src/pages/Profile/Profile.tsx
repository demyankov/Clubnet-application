import { FC, ReactElement, useEffect } from 'react';

import { Badge, Button, Group, Tabs, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  ProfileCreateTeamModal,
  ProfileImageUploader,
  ProfilePersonalDataForm,
} from 'components/profile';
import { TeamLink } from 'components/Team';
import { useAuth } from 'store/store';

const Profile: FC = () => {
  const { t } = useTranslation();
  const { getTeams, teams } = useAuth((store) => store);

  const handleOpenModal = (): void => {
    modals.open({
      modalId: 'ProfileCreateTeamModal',
      title: t('teams.modalTitle'),
      children: <ProfileCreateTeamModal />,
      centered: true,
    });
  };

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  const teamsItems: ReactElement[] = teams.map((team) => (
    <TeamLink key={team.id} teamData={team} />
  ));

  return (
    <>
      <Group mih={150} pt="20px" pb="20px">
        <ProfileImageUploader />
        <ProfilePersonalDataForm />
      </Group>

      <Tabs defaultValue="teams" h="100%" mt={20}>
        <Tabs.List mb={30}>
          <Tabs.Tab
            value="teams"
            rightSection={
              <Badge w={16} h={16} variant="filled" size="xs" p={0}>
                {teams.length}
              </Badge>
            }
          >
            {t('profile.profileTeams')}
          </Tabs.Tab>
          <Tabs.Tab
            value="friends"
            rightSection={
              <Badge w={16} h={16} variant="filled" size="xs" p={0}>
                0
              </Badge>
            }
          >
            {t('profile.profileFriends')}
          </Tabs.Tab>
          <Tabs.Tab value="stats">{t('profile.profileStats')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="teams" mih={350} mb={60}>
          <Group mb={30} align="center">
            <Text fz="xl" fw={700} inline align="center">
              {t('profile.profileTeams')}
            </Text>

            <Button
              onClick={handleOpenModal}
              variant="light"
              w={30}
              h={30}
              p={0}
              radius="100%"
            >
              <IconPlus size={15} />
            </Button>
          </Group>
          {teams.length ? (
            teamsItems
          ) : (
            <Text fz="xl" fw={700} mb={10}>
              {t('profile.createTeam')}
            </Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="friends" mih={350} mb={60}>
          <Text fz="xl" fw={700} mb={10}>
            {t('profile.profileFriends')}
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="stats" mih={350} mb={60}>
          <Text fz="xl" fw={700} mb={10}>
            {t('profile.profileStats')}
          </Text>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Profile;
