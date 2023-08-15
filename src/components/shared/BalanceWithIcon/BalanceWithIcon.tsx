import { FC } from 'react';

import { Box, createStyles, Text } from '@mantine/core';
import { FaCoins } from 'react-icons/fa';

const useStyles = createStyles(() => ({
  balance: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: 800,
    color: 'goldenrod',
    lineHeight: '0',
  },
}));

type Props = {
  balance?: number;
};

export const BalanceWithIcon: FC<Props> = ({ balance = 0 }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.balance}>
      <FaCoins size="20" />
      <Text fw="700">{balance}</Text>
    </Box>
  );
};
