import { FC } from 'react';

import { ActionIcon, createStyles, Flex, Group, Image, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5';

import { BalanceWithIcon } from 'components/shared';
import { isDarkTheme } from 'helpers';
import { IProductDataWithCount } from 'store/slices/shop/basketSlice';
import { useAuth, useShop } from 'store/store';

const useStyles = createStyles((theme) => ({
  productContainer: {
    padding: '5px',
    '&:hover': {
      backgroundColor: isDarkTheme(theme.colorScheme)
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    },
  },
}));

type Props = {
  userId: string;
  orderConfirmationId: string;
  product: IProductDataWithCount;
};

export const ConfirmProduct: FC<Props> = ({
  product: { id, name, price, categoryId, countProduct, image },
  orderConfirmationId,
  userId,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const { orderConfirmation, orderRevoke, currentOrderConfirmationId } = useShop();
  const { user } = useAuth();

  const isFetching = categoryId === currentOrderConfirmationId;
  const adminId = user?.id;
  const totalBalance = countProduct * price;

  const handleOrderConfirmation = (): void => {
    if (!adminId) {
      return;
    }

    orderConfirmation(
      -totalBalance,
      adminId,
      userId,
      {
        id,
        name,
        price,
        categoryId,
        countProduct,
      },
      orderConfirmationId,
    );
  };

  const handleOrderRevoke = (): void => {
    if (!adminId) {
      return;
    }

    orderRevoke(userId, totalBalance, id, countProduct, orderConfirmationId);
  };

  return (
    <Flex justify="space-between" className={classes.productContainer}>
      <Group noWrap spacing={10} w="100%">
        <Image src={image} withPlaceholder height={60} width={60} radius={5} />

        <>
          <Text size="sm" weight={500} pb={5}>
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            <Flex gap={5} align="center">
              <BalanceWithIcon balance={price} /> X {countProduct} {t('basket.item')}
            </Flex>
          </Text>
        </>
      </Group>
      <Flex align="center" gap={10} p={10}>
        <ActionIcon onClick={handleOrderConfirmation} color="green" disabled={isFetching}>
          <IoCheckmarkSharp size="5rem" />
        </ActionIcon>

        <ActionIcon onClick={handleOrderRevoke} color="red" disabled={isFetching}>
          <IoCloseSharp size="5rem" />
        </ActionIcon>
      </Flex>
    </Flex>
  );
};
