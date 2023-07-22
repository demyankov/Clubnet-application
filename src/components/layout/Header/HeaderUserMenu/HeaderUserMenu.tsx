import { FC } from 'react';

import { Avatar, Box, createStyles, Flex, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { UserBalance } from 'components/shared';
import { Paths } from 'constants/paths';
import { useAuth } from 'store/store';

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

  return (
    <Group spacing="sm">
      <Box className={classes.avatarContainer}>
        <Avatar src={user?.image} onClick={() => navigate(Paths.profile)} />
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
