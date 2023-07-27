import { FC } from 'react';

import { Avatar, createStyles, Flex, Text, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { FriendStatus } from 'constants/friendStatus';
import { IsViewedActions } from 'constants/isViewedActions';
import { Paths } from 'constants/paths';
import { isDarkTheme } from 'helpers';
import { useElapsedTime } from 'hooks/useElapsedTime';
import { INotifyFriends } from 'store/slices/friends/friendSlice';
import { useAuth, useFriends } from 'store/store';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: '5px',
    marginTop: '5px',
    borderRadius: '5px',
    color: isDarkTheme(theme.colorScheme) ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: isDarkTheme(theme.colorScheme)
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    },
  },
  viewed: {
    backgroundColor: isDarkTheme(theme.colorScheme)
      ? theme.colors.gray[8]
      : theme.colors.gray[0],
  },
  descriptionWrapper: {
    flex: 1,
  },
}));

type Props = {
  userFriend: INotifyFriends;
  onClose: () => void;
};
export const UserNotify: FC<Props> = ({
  userFriend: { id, name, nickName, timestamp, status, isViewed, image },
  onClose,
}) => {
  const { classes, cx } = useStyles();

  const { t } = useTranslation();

  const { isViewedUpdate } = useFriends((state) => state);
  const { user } = useAuth((state) => state);

  const navigate = useNavigate();

  const elapsedTime = useElapsedTime(timestamp.seconds);

  const isFriendRemoveViewed =
    status === FriendStatus.friend ? IsViewedActions.remove : undefined;
  const isFriend = status === FriendStatus.friend;

  const handleOnClick = (): void => {
    navigate(generatePath(`${Paths.player}/:nickname`, { nickname: nickName }));
    onClose();
    if (user) {
      isViewedUpdate({ clientId: id, playerId: user.id }, isFriendRemoveViewed);
    }
  };

  return (
    <UnstyledButton
      onClick={handleOnClick}
      className={cx(classes.user, { [classes.viewed]: isViewed })}
    >
      <Flex justify="space-between" gap={10} align="center">
        <Avatar src={image} radius="xl" />

        <div className={classes.descriptionWrapper}>
          <Flex justify="space-between">
            <Text size="sm" weight={500}>
              {name}
            </Text>
            <Text color="dimmed" size="xs">
              {elapsedTime}
            </Text>
          </Flex>

          <Text color="dimmed" size="xs">
            {nickName}
          </Text>

          <Text color="dimmed" size="xs">
            {isFriend ? t('profile.addedFriend') : t('profile.wantsAdded')}
          </Text>
        </div>

        <IconChevronRight size="0.9rem" stroke={1.5} />
      </Flex>
    </UnstyledButton>
  );
};
