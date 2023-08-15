import { FC, useEffect } from 'react';

import { Button, Center, createStyles, Tabs, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';
import { IoAddSharp } from 'react-icons/io5';

import { RenderContentContainer } from 'components/shared';
import { AddCategoryModal, ProductList } from 'components/shop';
import { isDarkTheme } from 'helpers';
import { useRole } from 'hooks';
import { useShop } from 'store/store';

const useStyles = createStyles((theme) => ({
  button: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    ...theme.fn.hover({
      backgroundColor: isDarkTheme(theme.colorScheme)
        ? theme.colors.dark[4]
        : theme.colors.gray[0],
    }),
  },
}));

export const Shop: FC = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const handleCategoryCreate = (): void => {
    modals.open({
      modalId: 'addCategoryModal',
      title: t('shop.addCategory'),
      children: <AddCategoryModal />,
      centered: true,
    });
  };

  const { isAdmin } = useRole();

  const {
    products,
    totalCountProduct,
    getCategories,
    categories,
    isCategoriesFetching,
    isGetMoreProductsFetching,
    defaultCategory,
    getProductsByCategoryId,
    getMoreProductsByCategoryId,
  } = useShop();

  const handleGetProduct = (categoryId: string, categoryName: string): void => {
    getProductsByCategoryId(categoryId, categoryName);
  };

  const IsShowMoreButtonShown = totalCountProduct > products.length;

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <RenderContentContainer isFetching={isCategoriesFetching}>
      <Text size={30} fw={600} p={10}>
        {t('shop.shop')}
      </Text>
      <Tabs keepMounted={false} value={defaultCategory} pb={60}>
        <Tabs.List>
          {categories.map(({ id, name }) => (
            <Tabs.Tab key={id} value={name} onClick={() => handleGetProduct(id, name)}>
              {name}
            </Tabs.Tab>
          ))}
          {isAdmin && (
            <Button
              onClick={handleCategoryCreate}
              variant="subtle"
              color="dark"
              className={classes.button}
            >
              <IoAddSharp size={20} /> {t('shop.addCategory')}
            </Button>
          )}
        </Tabs.List>

        {categories.map(({ id, name }) => (
          <ProductList key={id} categoryId={id} categoryName={name} />
        ))}
        {IsShowMoreButtonShown && (
          <Center pt={20}>
            <Button
              onClick={getMoreProductsByCategoryId}
              loading={isGetMoreProductsFetching}
            >
              {t('tournaments.showMore')}
            </Button>
          </Center>
        )}
      </Tabs>
    </RenderContentContainer>
  );
};
