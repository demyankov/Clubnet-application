import { FC, useEffect } from 'react';

import {
  ActionIcon,
  Center,
  createStyles,
  Drawer,
  Group,
  Indicator,
  Text,
} from '@mantine/core';
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

  isEmpty: {
    height: 'calc(100vh - 150px)',
    opacity: 0.3,
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
        {!notifyFriend.length && (
          <Center className={classes.isEmpty} maw={400} mx="auto">
            <IoNotificationsSharp size={50} />
            <Text p={10} fz="1.1em" fw={500} align="center">
              {t('profile.emptyNotifications')}
            </Text>
          </Center>
        )}
        {!!notifyFriend.length && (
          <>
            {notifyFriend.map((friend) => (
              <UserNotify key={friend.id} onClose={close} userFriend={friend} />
            ))}
          </>
        )}
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
