import { FC } from 'react';

import {
  Button,
  Card,
  Center,
  createStyles,
  Flex,
  Image,
  rem,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoCloseSharp } from 'react-icons/io5';

import { BalanceWithIcon } from 'components/shared';
import { isDarkTheme } from 'helpers';
import { useAuth, useShop } from 'store/store';

const useStyles = createStyles((theme) => ({
  card: {
    width: '250px',
    backgroundColor: isDarkTheme(theme.colorScheme) ? theme.colors.dark[7] : theme.white,
  },

  imageSection: {
    padding: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `${rem(1)} solid ${
      isDarkTheme(theme.colorScheme) ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      isDarkTheme(theme.colorScheme) ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

type Props = {
  id: string;
  price: number;
  name: string;
  image: Nullable<string>;
  countProduct: number;
};

export const BasketItem: FC<Props> = ({ id, image, price, name, countProduct }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const { removeProductFromBasket } = useShop();
  const { user } = useAuth();

  const handleRemoveProduct = (): void => {
    if (!user) {
      return;
    }

    removeProductFromBasket(user.id, id);
  };

  const totalCost = price * countProduct;

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image withPlaceholder src={image} alt={name} height={180} fit="contain" />
      </Card.Section>

      <Center p={5}>
        <Text fw={500} c="dimmed" fz="sm">
          {name}
        </Text>
      </Center>

      <Center p={5}>
        <Flex gap={3} align="center">
          <BalanceWithIcon balance={price} />
          <IoCloseSharp />
          <Text fw={500} c="dimmed">
            {countProduct} {t('basket.item')}
          </Text>
        </Flex>
      </Center>

      <Card.Section className={classes.section}>
        <Flex justify="space-between">
          <Text fz="xl" fw={700}>
            <BalanceWithIcon balance={totalCost} />
          </Text>

          <Button onClick={handleRemoveProduct} radius="xl">
            {t('basket.remove')}
          </Button>
        </Flex>
      </Card.Section>
    </Card>
  );
};
