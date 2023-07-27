import { FC } from 'react';

import { Badge, Button, Center, Tabs } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { FriendCard } from 'components/player';
import { RenderContentContainer } from 'components/shared';
import { CardContainer } from 'components/shared/CardContainer/CardContainer';
import { FriendStatus } from 'constants/friendStatus';
import { TabsValues } from 'constants/tabs';
import { useFriends } from 'store/store';

type Props = {
  userId: string;
};

export const ProfileFriends: FC<Props> = ({ userId }) => {
  const {
    getFriendRequests,
    friends,
    totalCount,
    friendRequests,
    isFriendsFetching,
    isGetMoreFetching,
    isFriendRequestsFetching,
    getMoreFriends,
  } = useFriends((state) => state);

  const { t } = useTranslation();

  const isShowMoreButtonShown = totalCount > friends.length;
  const isLoading = isFriendsFetching || isFriendRequestsFetching;

  const handleGetSentFriend = (): void => {
    getFriendRequests(userId, FriendStatus.sent);
  };
  const handleGetRequestFriend = (): void => {
    getFriendRequests(userId, FriendStatus.request);
  };
  const handleGetMoreFriends = (): void => {
    getMoreFriends(userId);
  };

  return (
    <Tabs defaultValue={TabsValues.friends} h="100%" pl={20} pr={20}>
      <Tabs.List mb={30}>
        <Tabs.Tab
          value={TabsValues.friends}
          rightSection={
            <Badge w={16} h={16} variant="filled" size="xs" p={0}>
              {totalCount}
            </Badge>
          }
        >
          {t('profile.friends')}
        </Tabs.Tab>

        <Tabs.Tab onClick={handleGetSentFriend} value={FriendStatus.sent}>
          {t('profile.sent')}
        </Tabs.Tab>

        <Tabs.Tab onClick={handleGetRequestFriend} value={FriendStatus.request}>
          {t('profile.request')}
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={TabsValues.friends} mih={350} mb={60}>
        <RenderContentContainer isFetching={isFriendsFetching}>
          <CardContainer>
            {friends.map((item) => (
              <FriendCard
                key={item.id}
                nickname={item.nickName}
                name={item.name}
                image={item.image}
              />
            ))}
          </CardContainer>
          <Center m="20px">
            {isShowMoreButtonShown && (
              <Button m="20px" onClick={handleGetMoreFriends} loading={isGetMoreFetching}>
                {t('tournaments.showMore')}
              </Button>
            )}
          </Center>
        </RenderContentContainer>
      </Tabs.Panel>

      <Tabs.Panel value={TabsValues.sent} mih={350} mb={60}>
        <RenderContentContainer isFetching={isLoading}>
          <CardContainer>
            {friendRequests.map((item) => (
              <FriendCard
                key={item.id}
                clientId={userId}
                playerId={item.id}
                nickname={item.nickName}
                name={item.name}
                image={item.image}
                status={item.status}
              />
            ))}
          </CardContainer>
        </RenderContentContainer>
      </Tabs.Panel>

      <Tabs.Panel value={TabsValues.request} mih={350} mb={60}>
        <RenderContentContainer isFetching={isLoading}>
          <CardContainer>
            {friendRequests.map((item) => (
              <FriendCard
                key={item.id}
                nickname={item.nickName}
                name={item.name}
                image={item.image}
              />
            ))}
          </CardContainer>
        </RenderContentContainer>
      </Tabs.Panel>
    </Tabs>
  );
};
