import { FC } from 'react';

import { Avatar, Box, createStyles, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { useAuth } from 'store/store';

const useStyles = createStyles((theme) => ({
  hiddenMobile: {
    [theme.fn.smallerThan(500)]: {
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

  return (
    <Group>
      <Box className={classes.avatarContainer}>
        <Avatar src={user?.image} onClick={() => navigate(Paths.profile)} />
      </Box>
      <Box className={classes.hiddenMobile}>{user?.name}</Box>
    </Group>
  );
};
