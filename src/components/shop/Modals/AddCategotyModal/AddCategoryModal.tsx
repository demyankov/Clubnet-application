import { FC } from 'react';

import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { IAddCategory } from 'components/shop/types';
import { useShop } from 'store/store';

export const AddCategoryModal: FC = () => {
  const { t } = useTranslation();

  const { addCategory, isAddCategoriesFetching } = useShop();

  const { values, reset, onSubmit, getInputProps } = useForm<IAddCategory>({
    initialValues: {
      name: '',
    },
  });

  const handleSubmit = ({ name }: typeof values): void => {
    addCategory(name, reset);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack spacing="xl">
        <TextInput withAsterisk label={t('shop.name')} {...getInputProps('name')} />

        <Group position="right" mt="md">
          <Button type="submit" disabled={isAddCategoriesFetching}>
            {t('shop.add')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
