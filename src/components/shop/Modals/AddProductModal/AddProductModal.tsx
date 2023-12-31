import { FC } from 'react';

import { Button, FileInput, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { IAddProductForm } from 'components/shop/types';
import { ALLOWED_IMAGE_FORMATS } from 'constants/allowedImageFormats';
import { useShop } from 'store/store';

type Props = {
  categoryId: string;
};

export const AddProductModal: FC<Props> = ({ categoryId }) => {
  const { t } = useTranslation();

  const { addProduct, isAddProductsFetching } = useShop();

  const { values, reset, onSubmit, getInputProps } = useForm<IAddProductForm>({
    initialValues: {
      name: '',
      quantity: '',
      price: '',
      image: null,
    },
    validate: {
      name: hasLength({ min: 3, max: 30 }, t('shop.validationAddProductName')),
      quantity: (value) => (+value <= 0 ? t('shop.validationAddProductQuantity') : null),
      price: (value) => (+value <= 0 ? t('shop.validationAddProductPrice') : null),
      image: (value) => (value === null ? t('shop.validationAddProductImage') : null),
    },
  });

  const handleSubmit = ({ price, quantity, image, name }: typeof values): void => {
    addProduct(
      {
        name,
        quantity: +quantity,
        price: +price,
        image,
      },
      categoryId,
      reset,
    );
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack spacing="xl">
        <TextInput
          withAsterisk
          label={t('shop.name')}
          placeholder={t('shop.name')!}
          {...getInputProps('name')}
        />

        <NumberInput
          hideControls
          withAsterisk
          type="number"
          placeholder={t('shop.quantity')!}
          label={t('shop.quantity')}
          {...getInputProps('quantity')}
        />

        <NumberInput
          hideControls
          withAsterisk
          type="number"
          placeholder={t('shop.price')!}
          label={t('shop.price')}
          {...getInputProps('price')}
        />

        <FileInput
          withAsterisk
          accept={ALLOWED_IMAGE_FORMATS}
          label={t('modals.addImage')}
          placeholder={t('modals.addImage')!}
          icon={<IconUpload size={15} />}
          {...getInputProps('image')}
        />
        <Group position="right" mt="md">
          <Button disabled={isAddProductsFetching} type="submit">
            {t('shop.add')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
