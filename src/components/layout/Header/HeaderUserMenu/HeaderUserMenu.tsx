import { FC, useEffect } from 'react';

import { Avatar, Box, createStyles, Flex, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { UserBalance } from 'components/shared';
import { Paths } from 'constants/paths';
import { useAuth, useFriends } from 'store/store';

const useStyles = createStyles((theme) => ({
  hiddenMobile: {
    [theme.fn.smallerThan(370)]: {
      display: 'none',
    },
  },
  avatarContainer: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    width: '47px',
  },
}));

export const HeaderUserMenu: FC = () => {
  const { classes } = useStyles();

  const navigate = useNavigate();

  const { user } = useAuth((state) => state);
  const { getNotifyFriend } = useFriends((state) => state);

  useEffect(() => {
    if (user) {
      getNotifyFriend(user?.id);
    }
  }, [getNotifyFriend, user]);

  const navigateToProfile = (): void => {
    navigate(Paths.profile);
  };

  return (
    <Group spacing="sm">
      <Box className={classes.avatarContainer}>
        <Avatar src={user?.image} onClick={navigateToProfile} />
      </Box>

      <Flex direction="column">
        <Text fz="xs" className={classes.hiddenMobile}>
          {user?.nickName}
        </Text>

        <UserBalance balance={user?.balance} />
      </Flex>
    </Group>
  );
};
