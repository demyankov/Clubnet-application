import { FC } from 'react';

import { Button, Center, Tabs } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { FriendCard, CardContainer, BadgeTotalCount, IsEmptyContainer } from 'components';
import { FriendStatus } from 'constants/friendStatus';
import { TabsValues } from 'constants/tabs';
import { useFriends } from 'store/store';

type Props = {
  userId: string;
};

export const ProfileFriends: FC<Props> = ({ userId }) => {
  const {
    friends,
    isGetMoreFetching,
    totalCountFriend,
    getMoreFriends,
    friendSent,
    friendRequest,
  } = useFriends((state) => state);

  const { t } = useTranslation();

  const isShowMoreButtonShown = totalCountFriend > friends.length;

  const handleGetMoreFriends = (): void => {
    getMoreFriends(userId);
  };

  return (
    <Tabs variant="outline" defaultValue={TabsValues.friends} h="100%" pl={20} pr={20}>
      <Tabs.List mb={30}>
        <Tabs.Tab
          value={TabsValues.friends}
          rightSection={<BadgeTotalCount totalCount={totalCountFriend} />}
        >
          {t('profile.friends')}
        </Tabs.Tab>

        <Tabs.Tab
          value={FriendStatus.sent}
          rightSection={<BadgeTotalCount totalCount={friendSent.length} />}
        >
          {t('profile.sent')}
        </Tabs.Tab>

        <Tabs.Tab
          value={FriendStatus.request}
          rightSection={<BadgeTotalCount totalCount={friendRequest.length} />}
        >
          {t('profile.request')}
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={TabsValues.friends} mih={350} mb={60}>
        <IsEmptyContainer emptyTitle={t('friends.emptyList')} isEmpty={!totalCountFriend}>
          <CardContainer>
            {friends.map(({ id, name, image, nickName }) => (
              <FriendCard key={id} nickname={nickName} name={name} image={image} />
            ))}
          </CardContainer>

          {isShowMoreButtonShown && (
            <Center m="20px">
              <Button m="20px" onClick={handleGetMoreFriends} loading={isGetMoreFetching}>
                {t('tournaments.showMore')}
              </Button>
            </Center>
          )}
        </IsEmptyContainer>
      </Tabs.Panel>

      <Tabs.Panel value={TabsValues.sent} mih={350} mb={60}>
        <IsEmptyContainer
          emptyTitle={t('friends.emptySentList')}
          isEmpty={!friendSent.length}
        >
          <CardContainer>
            {friendSent.map(({ id, status, nickName, name, image }) => (
              <FriendCard
                key={id}
                clientId={userId}
                playerId={id}
                nickname={nickName}
                name={name}
                image={image}
                status={status}
              />
            ))}
          </CardContainer>
        </IsEmptyContainer>
      </Tabs.Panel>

      <Tabs.Panel value={TabsValues.request} mih={350} mb={60}>
        <IsEmptyContainer
          emptyTitle={t('friends.emptyRequestList')}
          isEmpty={!friendRequest.length}
        >
          <CardContainer>
            {friendRequest.map(({ id, nickName, name, image }) => (
              <FriendCard key={id} nickname={nickName} name={name} image={image} />
            ))}
          </CardContainer>
        </IsEmptyContainer>
      </Tabs.Panel>
    </Tabs>
  );
};
