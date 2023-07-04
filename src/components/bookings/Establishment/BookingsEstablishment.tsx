import { FC, useEffect, useState } from 'react';

import {
  Button,
  Card,
  Center,
  TextInput,
  Title,
  UnstyledButton,
  Grid,
  Text,
  createStyles,
  Flex,
  Divider,
  LoadingOverlay,
  Loader,
  Box,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconPlus,
  IconBuilding,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
  open: () => void;
};

export const BookingsEstablishment: FC<Props> = ({ open }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const {
    establishmentActions: {
      isEstablishmentFetching,
      isUpdating,
      currentEstablishment,
      updateEstablishment,
      deleteEstablishment,
    },
    addressActions: { isAddressFetching, addresses },
  } = useBookings((state) => state);
  const [name, setName] = useState<string>('');
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { classes } = useStyles();

  useEffect(() => {
    if (currentEstablishment) {
      setName(currentEstablishment.name);
    }
  }, [currentEstablishment]);

  const handleClick = (id: string): void => {
    navigate(`${Paths.bookings}/${id}`);
  };

  const handleUpdateEstablishment = (): void => {
    if (name) {
      updateEstablishment({ name });
      setIsEditMode(false);
    }
  };

  const handleDeleteEstablishment = (): void => {
    modals.openConfirmModal({
      title: t('establishments.deleteEstablishment'),
      centered: true,
      children: <Text size="sm">{t('establishments.agreeToDeleteEstablishment')}</Text>,
      labels: { confirm: t('modals.btnDelete'), cancel: t('modals.btnCancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteEstablishment();
      },
    });
  };

  const addressCards =
    addresses &&
    addresses.map((address) => (
      <Grid.Col key={address.id} xs={6} sm={3}>
        <UnstyledButton
          w="100%"
          h={80}
          className={classes.btn}
          onClick={() => handleClick(address.id)}
        >
          <Card withBorder shadow="sm" h="100%">
            <Box>
              <IconBuilding className={classes.icon} />
              <Text size="md" className={classes.address}>
                {address.address}
              </Text>
            </Box>
            <Text size="xs" w="100%" className={classes.address}>
              {address.city}
            </Text>
          </Card>
        </UnstyledButton>
      </Grid.Col>
    ));

  const label = (
    <>
      <UnstyledButton mr="md" onClick={() => setIsEditMode(true)}>
        <IconEdit stroke={1.5} />
      </UnstyledButton>
      <UnstyledButton>
        <IconTrash stroke={1.5} onClick={handleDeleteEstablishment} />
      </UnstyledButton>
    </>
  );

  const establishmentName = isEditMode ? (
    <Flex justify="center" gap="xs" pos="relative">
      <LoadingOverlay
        visible={isUpdating}
        overlayBlur={0}
        overlayOpacity={0}
        loader={<Loader variant="dots" />}
      />
      <TextInput
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        disabled={isUpdating}
      />
      <Button disabled={isUpdating} onClick={handleUpdateEstablishment}>
        <IconCheck />
      </Button>
      <Button
        disabled={isUpdating}
        onClick={() => {
          setIsEditMode(false);
        }}
      >
        <IconX />
      </Button>
    </Flex>
  ) : (
    <Title order={1} size={27.7} align="center">
      {currentEstablishment?.name}
    </Title>
  );

  return (
    <>
      {isAdmin && !currentEstablishment && (
        <Center>
          {!isEstablishmentFetching && (
            <Button onClick={open}>{t('establishments.createEstablishment')}</Button>
          )}
        </Center>
      )}

      <RenderContentContainer
        isFetching={isEstablishmentFetching || isAddressFetching}
        isEmpty={!currentEstablishment}
        emptyTitle={t('establishments.noEstablishments')}
      >
        {establishmentName}

        <Divider my="sm" label={isAdmin ? label : null} labelPosition="center" />

        <Grid p="md" justify="center">
          {addressCards}

          {isAdmin && (
            <Grid.Col xs={6} sm={3}>
              <UnstyledButton onClick={open} w="100%" h={80} className={classes.btn}>
                <Card withBorder h="100%">
                  <Center h="100%">
                    <IconPlus />
                    <Text ml="xs">{t('establishments.addAddress')}</Text>
                  </Center>
                </Card>
              </UnstyledButton>
            </Grid.Col>
          )}
        </Grid>
      </RenderContentContainer>
    </>
  );
};
