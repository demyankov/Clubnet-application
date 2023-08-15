import { FC } from 'react';

import { Avatar, Box, createStyles, Flex, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { BalanceWithIcon } from 'components';
import { Paths } from 'constants/paths';
import { useAuth } from 'store/store';

const useStyles = createStyles((theme) => ({
  hiddenMobile: {
    [theme.fn.smallerThan(350)]: {
      display: 'none',
    },
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '47px',
  },

  userMenuContainer: {
    cursor: 'pointer',
  },
}));

export const HeaderUserMenu: FC = () => {
  const { classes } = useStyles();

  const navigate = useNavigate();

  const { user } = useAuth((state) => state);

  const navigateToProfile = (): void => {
    navigate(Paths.profile);
  };

  return (
    <Group onClick={navigateToProfile} className={classes.userMenuContainer} spacing="sm">
      <Box className={classes.avatarContainer}>
        <Avatar src={user?.image} />
      </Box>

      <Flex direction="column">
        <Text fz="xs" className={classes.hiddenMobile}>
          {user?.nickName}
        </Text>

        <BalanceWithIcon balance={user?.balance} />
      </Flex>
    </Group>
  );
};
