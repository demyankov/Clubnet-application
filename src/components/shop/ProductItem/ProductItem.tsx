import { FC } from 'react';

import {
  ActionIcon,
  Button,
  Card,
  Center,
  createStyles,
  Flex,
  Group,
  Image,
  NumberInput,
  rem,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { IoAddSharp, IoRemoveSharp } from 'react-icons/io5';

import { BalanceWithIcon } from 'components/shared';
import { IProductItemForm } from 'components/shop/types';
import { isDarkTheme } from 'helpers';
import { IProductData } from 'store/slices/shop/shopSlice';
import { useAuth, useShop } from 'store/store';

const useStyles = createStyles((theme) => ({
  card: {
    width: '280px',
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
  input: {
    width: rem(54),
    textAlign: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      isDarkTheme(theme.colorScheme) ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

type Props = {
  product: IProductData;
};

export const ProductItem: FC<Props> = ({ product }) => {
  const { id, name, price, quantity, image } = product;

  const { t } = useTranslation();
  const { classes } = useStyles();

  const { addInBasket, currentProductId } = useShop();
  const { user } = useAuth();

  const { getInputProps, values, reset, onSubmit, setValues } = useForm<IProductItemForm>(
    {
      initialValues: {
        countProduct: 1,
      },
    },
  );

  const updateProductCount = (count: number): void => {
    setValues({ countProduct: values.countProduct + count });
  };

  const handleSubmit = ({ countProduct }: typeof values): void => {
    if (!user) {
      return;
    }
    addInBasket({ id, countProduct }, user.id, reset);
  };

  const moreQuantity = values.countProduct >= quantity;
  const lessQuantity = values.countProduct <= 1;
  const isLoadingAddToBasket = currentProductId === id;
  const disabledButtonAddToBasket = !quantity;

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Card withBorder radius="md" className={classes.card}>
        <Card.Section className={classes.imageSection}>
          <Image withPlaceholder src={image} alt={name} height={180} fit="contain" />
        </Card.Section>

        <Center p={5}>
          <Text fw={500} c="dimmed">
            {name}
          </Text>
        </Center>
        <Group position="apart" h={50}>
          <Group mb={5}>
            <Text fz="xs">{t('shop.quantity')}:</Text>
            <Text fw={500} c="dimmed">
              {quantity || (
                <Text fz="xs" color="red">
                  {t('shop.outOfStock')}
                </Text>
              )}
            </Text>
          </Group>
          {quantity && (
            <Group spacing={5}>
              <ActionIcon
                color="blue"
                variant="filled"
                size={22}
                radius={50}
                disabled={lessQuantity}
                onClick={() => updateProductCount(-1)}
              >
                <IoRemoveSharp />
              </ActionIcon>

              <NumberInput
                readOnly
                hideControls
                max={quantity}
                min={1}
                classNames={{ input: classes.input }}
                {...getInputProps('countProduct')}
              />

              <ActionIcon
                color="blue"
                variant="filled"
                size={22}
                radius={50}
                disabled={moreQuantity}
                onClick={() => updateProductCount(1)}
              >
                <IoAddSharp />
              </ActionIcon>
            </Group>
          )}
        </Group>

        <Card.Section className={classes.section}>
          <Flex justify="space-between">
            <Text fz="xl" fw={700}>
              <BalanceWithIcon balance={price * values.countProduct} />
            </Text>

            <Button
              loading={isLoadingAddToBasket}
              type="submit"
              radius="xl"
              disabled={disabledButtonAddToBasket}
            >
              {t('shop.addToBasket')}
            </Button>
          </Flex>
        </Card.Section>
      </Card>
    </form>
  );
};
