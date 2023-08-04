import { FC, useEffect } from 'react';

import { ActionIcon, createStyles, Drawer, Group, Indicator } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { IoNotificationsSharp } from 'react-icons/io5';

import { UserNotify } from 'components';
import { useFriends, useAuth } from 'store/store';

const useStyles = createStyles(() => ({
  content: {
    height: 'calc(100% - 60px)',
    marginTop: 60,
  },
}));

export const HeaderNotify: FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { t } = useTranslation();

  const { classes } = useStyles();

  const { user } = useAuth((state) => state);
  const { notifyFriend, totalCountNotify, getNotifyFriend } = useFriends(
    (state) => state,
  );

  useEffect(() => {
    if (user) {
      const unsubscribe = getNotifyFriend(user?.id);

      return () => {
        unsubscribe();
      };
    }
  }, [getNotifyFriend, user]);

  return (
    <>
      <Drawer
        size="xs"
        opened={opened}
        onClose={close}
        position="right"
        classNames={{ content: classes.content }}
        title={t('profile.notifications')}
      >
        {notifyFriend.map((friend) => (
          <UserNotify key={friend.id} onClose={close} userFriend={friend} />
        ))}
      </Drawer>

      <Group position="center">
        <Indicator
          disabled={!totalCountNotify}
          label={`+${totalCountNotify}`}
          size={16}
          offset={3}
          withBorder
        >
          <ActionIcon onClick={open} variant="filled">
            <IoNotificationsSharp size="1.3rem" />
          </ActionIcon>
        </Indicator>
      </Group>
    </>
  );
};
