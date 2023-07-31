import { FC, ReactElement, useEffect } from 'react';

import { Group, Tabs, Text, Avatar, Flex } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { ButtonAddFriend, FriendCard } from 'components/player';
import { BadgeTotalCount, RenderContentContainer } from 'components/shared';
import { CardContainer } from 'components/shared/CardContainer/CardContainer';
import { TeamLink } from 'components/Team';
import { TabsValues } from 'constants/tabs';
import { useAuth, useClients, useFriends } from 'store/store';

const Profile: FC = () => {
  const { t } = useTranslation();

  const { teams, getTeams, user } = useAuth((store) => store);
  const { getClientByNickname, client, isClientsFetching } = useClients((store) => store);
  const {
    getFriends,
    isFriendsFetching,
    friends,
    getFriendStatus,
    status,
    isStatusFetching,
    acceptRequest,
    declineRequest,
  } = useFriends();

  const { nickname } = useParams<{ nickname: string }>();

  const handleAcceptRequest = (): void => {
    if (client && user) {
      acceptRequest({ clientId: client.id, playerId: user.id });
    }
  };
  const handleDeclineRequest = (): void => {
    if (client && user) {
      declineRequest({ clientId: client.id, playerId: user.id });
    }
  };

  useEffect(() => {
    if (nickname) {
      getClientByNickname(nickname);
    }
  }, [nickname, getClientByNickname]);

  useEffect(() => {
    if (client && user) {
      getTeams(client.id);
      getFriends(client.id);
      getFriendStatus(user.id, client.id);
    }
  }, [getTeams, client, getFriends, getFriendStatus, user, status]);

  const teamsItems: ReactElement[] = teams.map((team) => (
    <TeamLink key={team.id} teamData={team} />
  ));

  const friendsItems: ReactElement[] = friends.map((friend) => (
    <FriendCard
      key={friend.id}
      nickname={friend.nickName}
      name={friend.name}
      image={friend.image}
    />
  ));

  const isLoading = isStatusFetching || isFriendsFetching || isClientsFetching;
  const isNotCurrentUserPage = user?.nickName !== nickname;

  return (
    <RenderContentContainer isFetching={isLoading}>
      <Flex justify="space-between" align="flex-end">
        <Group pt={20} pb={20}>
          <Avatar
            src={client && client.image}
            radius="100%"
            alt={t('profile.noAvatar') as string}
            size={200}
          />
          <div>
            {client && (
              <>
                <Text size="20px" fw={700} c="dimmed">
                  {client.name}
                </Text>
                <Text size="40px" fw={500} tt="uppercase" mt="-5px">
                  {client.nickName}
                </Text>
              </>
            )}
          </div>
        </Group>
        {isNotCurrentUserPage && (
          <ButtonAddFriend
            status={status}
            acceptRequest={handleAcceptRequest}
            declineRequest={handleDeclineRequest}
          />
        )}
      </Flex>

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
            rightSection={<BadgeTotalCount totalCount={friends.length} />}
          >
            {t('profile.profileFriends')}
          </Tabs.Tab>
          <Tabs.Tab value={TabsValues.stats}>{t('profile.profileStats')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={TabsValues.teams} mih={350} mb={60}>
          <Group mb={20}>
            <Text fz="xl" fw={700} mb={10}>
              {t('profile.profileTeams')}
            </Text>
          </Group>
          {teams.length && teamsItems}
        </Tabs.Panel>

        <Tabs.Panel value={TabsValues.friends} mih={350} mb={60}>
          <Text fz="xl" fw={700} mb={10}>
            {t('profile.profileFriends')}
          </Text>
          <CardContainer>{friends.length && friendsItems}</CardContainer>
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
