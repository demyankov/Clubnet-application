import { FC } from 'react';

import { Avatar, Box, createStyles, Group } from '@mantine/core';

import { useAuth } from 'store/store';

const useStyles = createStyles((theme) => ({
  hiddenMobile: {
    [theme.fn.smallerThan(500)]: {
      display: 'none',
    },
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '47px',
  },
}));

export const HeaderUserMenu: FC = () => {
  const { classes } = useStyles();

  const { user } = useAuth((state) => state);

  return (
    <Group>
      <Box className={classes.avatarContainer}>
        <Avatar src={user?.image} />
      </Box>
      <Box className={classes.hiddenMobile}>{user?.name}</Box>
    </Group>
  );
};
