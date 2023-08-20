import { FC, useEffect } from 'react';

import { Box, Group, Tabs, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import {
  ProfileImageUploader,
  ProfilePersonalDataForm,
  ProfileFriends,
  ProfileTeams,
  BadgeTotalCount,
} from 'components';
import { FriendStatus } from 'constants/friendStatus';
import { TabsValues } from 'constants/tabs';
import { useAuth, useFriends } from 'store/store';

const Profile: FC = () => {
  const { t } = useTranslation();
  const { user, teams } = useAuth((store) => store);

  const { getFriends, getTotalCount, getFriendRequests, totalCountFriend } = useFriends(
    (store) => store,
  );

  useEffect(() => {
    if (user) {
      getTotalCount(user.id);
      getFriends(user.id);
      getFriendRequests(user.id, FriendStatus.sent);
    }
  }, [getFriendRequests, getFriends, getTotalCount, user]);

  return (
    <Box>
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
          <ProfileTeams />
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
    </Box>
  );
};

export default Profile;
