import { FC, ReactElement, useEffect } from 'react';

import { Button, Group, Tabs, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  ProfileCreateTeamModal,
  ProfileImageUploader,
  ProfilePersonalDataForm,
} from 'components/profile';
import { ProfileFriends } from 'components/profile/ProfileFriends/ProfileFriends';
import { BadgeTotalCount, RenderContentContainer } from 'components/shared';
import { TeamLink } from 'components/Team';
import { FriendStatus } from 'constants/friendStatus';
import { TabsValues } from 'constants/tabs';
import { useAuth, useFriends } from 'store/store';

const Profile: FC = () => {
  const { t } = useTranslation();
  const { getTeams, teams, user, isTeamFetching } = useAuth((store) => store);
  const {
    getFriends,
    getTotalCount,
    getFriendRequests,
    totalCountFriend,
    isTotalCountFriendsFetching,
    isFriendsFetching,
  } = useFriends((store) => store);

  const handleOpenModal = (): void => {
    modals.open({
      modalId: 'ProfileCreateTeamModal',
      title: t('teams.modalTitle'),
      children: <ProfileCreateTeamModal />,
      centered: true,
    });
  };

  const teamsItems: ReactElement[] = teams.map((team) => (
    <TeamLink key={team.id} teamData={team} />
  ));
  const isLoading = isTotalCountFriendsFetching || isFriendsFetching || isTeamFetching;

  useEffect(() => {
    if (user) {
      getTotalCount(user.id);
      getTeams(user.id);
      getFriends(user.id);
      getFriendRequests(user.id, FriendStatus.sent);
    }
  }, [getTeams, getFriendRequests, getFriends, getTotalCount, user]);

  return (
    <RenderContentContainer isFetching={isLoading}>
      <Group mih={150} pt="20px" pb="20px">
        <ProfileImageUploader />
        <ProfilePersonalDataForm />
      </Group>

      <Tabs defaultValue={TabsValues.teams} h="100%" mt={20}>
        <Tabs.List mb={30}>
          <Tabs.Tab
            value={TabsValues.teams}
            rightSection={<BadgeTotalCount totalCount={teams.length} />}
          >
            {t('profile.profileTeams')}
          </Tabs.Tab>
          <Tabs.Tab
            value={TabsValues.friends}
            rightSection={<BadgeTotalCount totalCount={totalCountFriend} />}
          >
            {t('profile.profileFriends')}
          </Tabs.Tab>
          <Tabs.Tab value={TabsValues.stats}>{t('profile.profileStats')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={TabsValues.teams} mih={350} mb={60}>
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

        <Tabs.Panel value={TabsValues.friends} mih={350} mb={60}>
          <ProfileFriends userId={user?.id || ''} />
        </Tabs.Panel>

        <Tabs.Panel value={TabsValues.stats} mih={350} mb={60}>
          <Text fz="xl" fw={700} mb={10}>
            {t('profile.profileStats')}
          </Text>
        </Tabs.Panel>
      </Tabs>
    </RenderContentContainer>
  );
};

export default Profile;
