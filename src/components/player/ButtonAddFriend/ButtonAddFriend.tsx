import { FC } from 'react';

import { Button, createStyles, Group, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

import { BUTTON_TEXT_CONFIG } from 'components/player/config';
import { RemoveFriendModal } from 'components/player/removeFriendModal/RemoveFriendModal';
import { FriendStatus } from 'constants/friendStatus';
import { isDarkTheme } from 'helpers';
import { IRequestData } from 'store/slices/friends/friendSlice';
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
  acceptRequest?: () => void;
  declineRequest?: () => void;
};

export const ButtonAddFriend: FC<Props> = ({ status, acceptRequest, declineRequest }) => {
  const { classes } = useStyles();

  const { addFriend } = useFriends();
  const { client } = useClients();
  const { user } = useAuth();

  const { t } = useTranslation();

  const isUserClient = client && user;
  const isUnknownStatus = status === FriendStatus.unknown;
  const isFriendStatus = status === FriendStatus.friend;

  const handleOpenModal = ({ clientId, playerId }: IRequestData): void => {
    modals.open({
      modalId: 'removeFriendModal',
      title: t('friends.confirmRemove'),
      children: <RemoveFriendModal clientId={clientId} playerId={playerId} />,
      centered: true,
    });
  };

  const handleFriend = (): void => {
    if (!isUserClient) {
      return;
    }

    if (isUnknownStatus) {
      addFriend({ clientId: client.id, playerId: user.id });
    }

    if (isFriendStatus) {
      handleOpenModal({ clientId: client.id, playerId: user.id });
    }
  };

  const isUnknownAndFriendStatus = isUnknownStatus || isFriendStatus;
  const isSent = status === FriendStatus.sent;

  return (
    <Group noWrap spacing={10}>
      {isSent ? (
        <>
          <Button className={classes.button} onClick={acceptRequest} variant="filled">
            {t('player.addFriend')}
          </Button>

          <Button
            className={classes.buttonReject}
            onClick={declineRequest}
            variant="filled"
          >
            {t('player.rejectFriend')}
          </Button>
        </>
      ) : (
        <Button
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
