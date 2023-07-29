import { FC } from 'react';

import { Box, Card, Grid, Text, UnstyledButton, createStyles } from '@mantine/core';
import { IconBuilding } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { IAddress } from 'store/slices/bookings/types';

const useStyles = createStyles((theme) => ({
  btn: {
    transition: 'all .15s',

    '&:hover': {
      transform: 'scale(1.03)',
    },
  },

  address: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: `calc(100% - 24px - ${theme.spacing.sm})`,
  },

  icon: {
    display: 'inline-block',
    marginRight: theme.spacing.sm,
  },
}));

type Props = {
  addresses: IAddress[];
};

export const BookingsAddressCards: FC<Props> = ({ addresses }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const handleReturn = (id: string): void => {
    navigate(`${Paths.bookings}/${id}`);
  };

  return (
    <>
      {addresses.map(({ id, address, city }) => {
        return (
          <Grid.Col key={id} xs={6} sm={3}>
            <UnstyledButton
              w="100%"
              h={80}
              className={classes.btn}
              onClick={() => handleReturn(id)}
            >
              <Card withBorder shadow="sm" h="100%">
                <Box>
                  <IconBuilding className={classes.icon} />
                  <Text size="md" className={classes.address}>
                    {address}
                  </Text>
                </Box>
                <Text size="xs" w="100%" className={classes.address}>
                  {city}
                </Text>
              </Card>
            </UnstyledButton>
          </Grid.Col>
        );
      })}
    </>
  );
};
