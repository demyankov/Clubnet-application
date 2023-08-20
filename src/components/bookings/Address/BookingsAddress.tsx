import { FC, useEffect } from 'react';

import {
  Button,
  Card,
  Center,
  createStyles,
  Divider,
  Drawer,
  Grid,
  Text,
  Title,
  LoadingOverlay,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconArrowLeft, IconReceipt } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';

import {
  BookingsAddressSettings,
  BookingsTableCards,
  BookingsAddressLabel,
  BookingsTable,
  BookingsBookingList,
  RenderContentContainer,
} from 'components';
import { Paths } from 'constants/paths';
import { isDarkTheme } from 'helpers';
import { useRole } from 'hooks';
import { useBookings } from 'store/store';

const useStyles = createStyles((theme) => ({
  btn: {
    transition: 'all .15s',

    '&:hover': {
      transform: 'scale(1.03)',
    },
  },

  goBack: {
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
  },

  btnText: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  addBtn: {
    border: '0.15rem solid',
    borderColor: isDarkTheme(theme.colorScheme)
      ? theme.colors.dark[4]
      : theme.colors.gray[3],
    borderStyle: 'dashed',
  },

  addressTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export const BookingsAddress: FC = () => {
  const {
    addressActions: { isAddressFetching, currentAddress, setCurrentAddress },
    tableActions: { isTableFetching, tables, currentTable, addTable, setCurrentTable },
    bookingActions: { resetBookings },
  } = useBookings((state) => state);
  const [settingsOpened, settingsActions] = useDisclosure(false);
  const [tableOpened, tableActions] = useDisclosure(false);
  const [bookingsOpened, bookingsActions] = useDisclosure(false);
  const { id } = useParams();
  const { isAdmin, isManager } = useRole();
  const { t } = useTranslation();
  const { classes } = useStyles();

  const handleOnCloseSettings = (): void => {
    tableActions.close();
    setCurrentTable();
    resetBookings();
  };

  useEffect(() => {
    if (id) {
      setCurrentAddress(id);
    }
  }, [setCurrentAddress, id]);

  const currentTableTitle = (
    <Text>
      {currentAddress?.city}, {currentAddress?.address} {t('tables.table')}
      {currentTable?.name}
    </Text>
  );

  const dividerLabel = isAdmin ? (
    <BookingsAddressLabel openSettings={settingsActions.open} />
  ) : null;

  return (
    <RenderContentContainer isFetching={isAddressFetching}>
      <LoadingOverlay visible={isTableFetching} />
      <Drawer
        opened={settingsOpened}
        onClose={settingsActions.close}
        title={t('address.addressSettings')}
        zIndex={101}
      >
        <BookingsAddressSettings close={settingsActions.close} />
      </Drawer>

      <Drawer
        opened={tableOpened}
        onClose={handleOnCloseSettings}
        title={currentTableTitle}
        zIndex={101}
      >
        <BookingsTable close={tableActions.close} />
      </Drawer>

      <Drawer
        opened={bookingsOpened}
        onClose={bookingsActions.close}
        position="right"
        title={t('tables.bookings')}
        zIndex={101}
      >
        <BookingsBookingList />
      </Drawer>

      <Grid align="center">
        <Grid.Col span={4}>
          <Button component={Link} to={Paths.bookings} className={classes.goBack}>
            <IconArrowLeft size={20} />
            <Text className={classes.btnText}>{t('address.back')}</Text>
          </Button>
        </Grid.Col>

        <Grid.Col span={4}>
          <Title order={4} ta="center">
            {currentAddress?.city}, {currentAddress?.address}
          </Title>
        </Grid.Col>

        {(isAdmin || isManager) && (
          <Grid.Col span={4} ta="right">
            <Button className={classes.goBack} onClick={bookingsActions.open}>
              <IconReceipt size={20} />
              <Text className={classes.btnText}>{t('address.showBookings')}</Text>
            </Button>
          </Grid.Col>
        )}
      </Grid>

      <Divider my="sm" label={dividerLabel} labelPosition="center" />

      <Grid p="md">
        {tables && <BookingsTableCards tables={tables} openTable={tableActions.open} />}

        {isAdmin && (
          <Grid.Col xs={6} sm={3}>
            <UnstyledButton onClick={addTable} w="100%" h={80} className={classes.btn}>
              <Card h="100%" className={classes.addBtn}>
                <Center h="100%">
                  <IconPlus />
                  <Text ml="xs">{t('address.addTable')}</Text>
                </Center>
              </Card>
            </UnstyledButton>
          </Grid.Col>
        )}
      </Grid>
    </RenderContentContainer>
  );
};
