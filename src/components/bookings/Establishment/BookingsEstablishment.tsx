import { FC, useState } from 'react';

import {
  Button,
  Card,
  Center,
  UnstyledButton,
  Grid,
  Text,
  createStyles,
  Divider,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  BookingEstablishmentLabel,
  BookingsEstablishmentName,
  BookingsAddressCards,
} from 'components';
import { RenderContentContainer } from 'components/shared';
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

  addButton: {
    border: '0.15rem solid',
    borderColor: isDarkTheme(theme.colorScheme)
      ? theme.colors.dark[4]
      : theme.colors.gray[3],
    borderStyle: 'dashed',
  },
}));

type Props = {
  open: () => void;
};

export const BookingsEstablishment: FC<Props> = ({ open }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const {
    establishmentActions: { isEstablishmentFetching, currentEstablishment },
    addressActions: { isAddressFetching, addresses },
  } = useBookings((state) => state);

  const { isAdmin } = useRole();
  const { t } = useTranslation();
  const { classes } = useStyles();

  const dividerLabel = isAdmin ? (
    <BookingEstablishmentLabel setIsEditMode={setIsEditMode} />
  ) : null;

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
        <BookingsEstablishmentName
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />

        <Divider my="sm" label={dividerLabel} labelPosition="center" />

        <Grid p="md">
          {addresses && <BookingsAddressCards addresses={addresses} />}

          {isAdmin && (
            <Grid.Col xs={6} sm={3}>
              <UnstyledButton onClick={open} w="100%" h={80} className={classes.btn}>
                <Card className={classes.addButton} h="100%">
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
