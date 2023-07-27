import { FC } from 'react';

import { Button, createStyles, Group, rem } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { BUTTON_TEXT_CONFIG } from 'components/player/config';
import { FriendStatus } from 'constants/friendStatus';
import { isDarkTheme } from 'helpers';
import { useAuth, useClients, useFriends } from 'store/store';

const useStyles = createStyles((theme) => ({
  button: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  buttonReject: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  menuControl: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: 0,
    borderLeft: `${rem(1)} solid ${
      isDarkTheme(theme.colorScheme) ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

type Props = {
  status: FriendStatus;
  isFetching: boolean;
  acceptRequest?: () => void;
  declineRequest?: () => void;
};

export const ButtonAddFriend: FC<Props> = ({
  status,
  isFetching,
  acceptRequest,
  declineRequest,
}) => {
  const { classes } = useStyles();

  const { addFriend, removeFriend } = useFriends();
  const { client } = useClients();
  const { user } = useAuth();

  const { t } = useTranslation();

  const isUserClient = client && user;
  const isUnknownStatus = status === FriendStatus.unknown;
  const isFriendStatus = status === FriendStatus.friend;

  const handleFriend = (): void => {
    if (!isUserClient) {
      return;
    }

    if (isUnknownStatus) {
      addFriend({ clientId: client.id, playerId: user.id });
    }

    if (isFriendStatus) {
      removeFriend({ clientId: client.id, playerId: user.id });
    }
  };

  const isUnknownAndFriendStatus = isUnknownStatus || isFriendStatus;
  const isSent = status === FriendStatus.sent;

  return (
    <Group noWrap spacing={10}>
      {isSent ? (
        <>
          <Button
            loading={isFetching}
            className={classes.button}
            onClick={acceptRequest}
            variant="filled"
          >
            {t('player.addFriend')}
          </Button>

          <Button
            loading={isFetching}
            className={classes.buttonReject}
            onClick={declineRequest}
            variant="filled"
          >
            {t('player.rejectFriend')}
          </Button>
        </>
      ) : (
        <Button
          loading={isFetching}
          className={classes.button}
          disabled={!isUnknownAndFriendStatus}
          onClick={handleFriend}
        >
          {t(`player.${BUTTON_TEXT_CONFIG[status]}`)}
        </Button>
      )}
    </Group>
  );
};
