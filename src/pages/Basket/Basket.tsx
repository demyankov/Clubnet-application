import { FC, useEffect } from 'react';

import { Button, createStyles, Divider, Flex, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { BalanceWithIcon } from 'components';
import { RenderContentContainer } from 'components/shared';
import { BasketItem } from 'components/shop';
import { useAuth, useShop } from 'store/store';

const useStyles = createStyles((theme) => ({
  mobile: {
    [theme.fn.smallerThan(550)]: {
      justifyContent: 'center',
    },
  },
  buttonBasket: {
    paddingTop: '40px',
    paddingBottom: '40px',
    gap: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
}));

export const Basket: FC = () => {
  const { t } = useTranslation();
  const { classes, cx } = useStyles();

  const {
    baskets,
    getBasket,
    isFetchingBasket,
    isFetchingBasketAction,
    basketTotalCounter,
    clearBasket,
    buyProductFromBasket,
  } = useShop();
  const { user } = useAuth();

  const userId = user?.id;
  const userBalance = user?.balance || 0;

  const totalCost = baskets.reduce(
    (ac, { price, countProduct }) => ac + price * countProduct,
    0,
  );

  const handleBuyProduct = (): void => {
    if (!userId) {
      return;
    }

    buyProductFromBasket(userId, userBalance, totalCost);
  };

  const handleRemoveBasket = (): void => {
    if (!userId) {
      return;
    }

    clearBasket(userId);
  };

  const insufficientBalance = userBalance && userBalance < totalCost;

  useEffect(() => {
    if (!userId) {
      return;
    }

    getBasket(userId);
  }, [getBasket, userId]);

  return (
    <RenderContentContainer
      isFetching={isFetchingBasket}
      isEmpty={!basketTotalCounter}
      emptyTitle={t('basket.isEmpty')}
    >
      <Text size={30} fw={600} p={10}>
        {t('basket.basketContents')}:
      </Text>
      <Flex gap={25} wrap="wrap" justify="flex-start" mb={50} className={classes.mobile}>
        {baskets.map(({ id, price, name, image, countProduct }) => (
          <BasketItem
            key={id}
            id={id}
            price={price}
            image={image}
            name={name}
            countProduct={countProduct}
          />
        ))}
      </Flex>

      <Divider my="sm" />
      <Flex gap={15} justify="flex-end">
        <Text fz="lg" fw="600">
          {t('basket.totalCost')}:
        </Text>
        <BalanceWithIcon balance={totalCost} />
      </Flex>

      {insufficientBalance && (
        <Flex justify="flex-end">
          <Text color="red">{t('basket.insufficientBalance')}</Text>
        </Flex>
      )}

      <div className={cx(classes.buttonBasket, classes.mobile)}>
        <Button size="md" disabled={isFetchingBasketAction} onClick={handleRemoveBasket}>
          {t('basket.clearBasket')}
        </Button>
        <Button size="md" onClick={handleBuyProduct} disabled={!!insufficientBalance}>
          {t('basket.purchase')}
        </Button>
      </div>
    </RenderContentContainer>
  );
};
