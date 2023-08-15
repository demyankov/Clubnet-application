import { FC } from 'react';

import { Card, createStyles, Flex, SimpleGrid, Tabs } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';
import { IoAddSharp } from 'react-icons/io5';

import { RenderContentContainer } from 'components/shared';
import { breakpointsContainer } from 'components/shop/config';
import { AddProductModal } from 'components/shop/Modals/AddProductModal/AddProductModal';
import { ProductItem } from 'components/shop/ProductItem/ProductItem';
import { isDarkTheme } from 'helpers';
import { useRole } from 'hooks';
import { useShop } from 'store/store';

const useStyles = createStyles((theme) => ({
  mobile: {
    [theme.fn.smallerThan(600)]: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  addProduct: {
    width: '280px',
    minHeight: '350px',
    cursor: 'pointer',
    ...theme.fn.hover({
      backgroundColor: isDarkTheme(theme.colorScheme)
        ? theme.colors.dark[4]
        : theme.colors.gray[0],
    }),
  },
}));

type Props = {
  categoryId: string;
  categoryName: string;
};

export const ProductList: FC<Props> = ({ categoryId, categoryName }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const { isAdmin } = useRole();

  const { products, isProductsFetching } = useShop();

  const handleProductCreate = (): void => {
    modals.open({
      modalId: 'addProductModal',
      title: t('shop.addProduct'),
      children: <AddProductModal categoryId={categoryId} />,
      centered: true,
    });
  };

  return (
    <Tabs.Panel value={categoryName} pt="xs">
      <RenderContentContainer isFetching={isProductsFetching}>
        <SimpleGrid
          cols={6}
          breakpoints={breakpointsContainer}
          className={classes.mobile}
        >
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
          {isAdmin && (
            <Card
              withBorder
              radius="md"
              onClick={handleProductCreate}
              className={classes.addProduct}
            >
              <Flex justify="center" align="center" h="100%">
                <IoAddSharp size={42} />
                {t('shop.addProduct')}
              </Flex>
            </Card>
          )}
        </SimpleGrid>
      </RenderContentContainer>
    </Tabs.Panel>
  );
};
