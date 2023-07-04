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
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconArrowLeft, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { BookingsAddressSettings } from 'components';
import { RenderContentContainer } from 'components/shared';
import { Paths } from 'constants/paths';
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
    position: 'absolute',
    left: theme.spacing.md,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
  },

  btnText: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}));

export const BookingsAddressInfo: FC = () => {
  const { isAddressFetching, currentAddress, setCurrentAddress, deleteAddress } =
    useBookings((state) => state.addressActions);
  const [opened, { open, close }] = useDisclosure(false);
  const { id } = useParams();
  const { isAdmin } = useRole();
  const { t } = useTranslation();
  const { classes } = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setCurrentAddress(id);
    }
  }, [setCurrentAddress, id]);

  const handleDeleteEstablishment = (): void => {
    modals.openConfirmModal({
      title: t('address.deleteAddress'),
      centered: true,
      children: <Text size="sm">{t('address.agreeToDeleteAddress')}</Text>,
      labels: { confirm: t('modals.btnDelete'), cancel: t('modals.btnCancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteAddress();
        navigate(Paths.bookings);
      },
    });
  };

  const label = (
    <>
      <UnstyledButton mr="md" onClick={open}>
        <IconEdit stroke={1.5} />
      </UnstyledButton>
      <UnstyledButton>
        <IconTrash stroke={1.5} onClick={handleDeleteEstablishment} />
      </UnstyledButton>
    </>
  );

  return (
    <RenderContentContainer isFetching={isAddressFetching}>
      <Drawer opened={opened} onClose={close} title="Address settings">
        <BookingsAddressSettings close={close} />
      </Drawer>

      <Title order={1} size={20} align="center" pos="relative">
        <Button component={Link} to={Paths.bookings} className={classes.goBack}>
          <IconArrowLeft size={20} />
          <Text className={classes.btnText}>{t('address.back')}</Text>
        </Button>
        {currentAddress?.city}, {currentAddress?.address}
      </Title>

      <Divider my="sm" label={isAdmin ? label : null} labelPosition="center" />

      <Grid p="md" justify="center">
        {isAdmin && (
          <Grid.Col xs={6} sm={3}>
            <UnstyledButton w="100%" h={80} className={classes.btn}>
              <Card withBorder h="100%">
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
