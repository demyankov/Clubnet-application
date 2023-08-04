import { FC } from 'react';

import { Button, Center, createStyles, Tabs } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import {
  FriendCard,
  RenderContentContainer,
  CardContainer,
  BadgeTotalCount,
} from 'components';
import { FriendStatus } from 'constants/friendStatus';
import { TabsValues } from 'constants/tabs';
import { useFriends } from 'store/store';

type Props = {
  userId: string;
};

const useStyles = createStyles(() => ({
  container: {
    position: 'relative',
    minHeight: 'calc(100vh - 600.89px)',
  },
}));

export const ProfileFriends: FC<Props> = ({ userId }) => {
  const {
    getFriendRequests,
    friends,
    totalCountFriend,
    totalCountSent,
    totalCountRequest,
    friendRequests,
    isFriendsFetching,
    isGetMoreFetching,
    isFriendRequestsFetching,
    getMoreFriends,
  } = useFriends((state) => state);

  const { t } = useTranslation();

  const { classes } = useStyles();

  const isShowMoreButtonShown = totalCountFriend > friends.length;
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
    <Tabs variant="outline" defaultValue={TabsValues.friends} h="100%" pl={20} pr={20}>
      <Tabs.List mb={30}>
        <Tabs.Tab
          value={TabsValues.friends}
          rightSection={<BadgeTotalCount totalCount={totalCountFriend} />}
        >
          {t('profile.friends')}
        </Tabs.Tab>

        <Tabs.Tab
          onClick={handleGetSentFriend}
          value={FriendStatus.sent}
          rightSection={<BadgeTotalCount totalCount={totalCountSent} />}
        >
          {t('profile.sent')}
        </Tabs.Tab>

        <Tabs.Tab
          onClick={handleGetRequestFriend}
          value={FriendStatus.request}
          rightSection={<BadgeTotalCount totalCount={totalCountRequest} />}
        >
          {t('profile.request')}
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={TabsValues.friends} mih={350} mb={60}>
        <div className={classes.container}>
          <RenderContentContainer
            isFetching={isLoading}
            emptyTitle={t('friends.emptyList')}
            isEmpty={!totalCountFriend}
          >
            <CardContainer>
              {friends.map(({ id, name, image, nickName }) => (
                <FriendCard key={id} nickname={nickName} name={name} image={image} />
              ))}
            </CardContainer>

            {isShowMoreButtonShown && (
              <Center m="20px">
                <Button
                  m="20px"
                  onClick={handleGetMoreFriends}
                  loading={isGetMoreFetching}
                >
                  {t('tournaments.showMore')}
                </Button>
              </Center>
            )}
          </RenderContentContainer>
        </div>
      </Tabs.Panel>

      <Tabs.Panel value={TabsValues.sent} mih={350} mb={60}>
        <div className={classes.container}>
          <RenderContentContainer
            isFetching={isLoading}
            emptyTitle={t('friends.emptySentList')}
            isEmpty={!totalCountSent}
          >
            <CardContainer>
              {friendRequests.map(({ id, status, nickName, name, image }) => (
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
          </RenderContentContainer>
        </div>
      </Tabs.Panel>

      <Tabs.Panel value={TabsValues.request} mih={350} mb={60}>
        <div className={classes.container}>
          <RenderContentContainer
            isFetching={isLoading}
            emptyTitle={t('friends.emptyRequestList')}
            isEmpty={!totalCountRequest}
          >
            <CardContainer>
              {friendRequests.map(({ id, nickName, name, image }) => (
                <FriendCard key={id} nickname={nickName} name={name} image={image} />
              ))}
            </CardContainer>
          </RenderContentContainer>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};
