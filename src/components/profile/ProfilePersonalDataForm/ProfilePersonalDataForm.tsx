import { FC, useState } from 'react';

import { Button, Container, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { useAuth } from 'store/store';
import { IUser } from 'store/types';

export const ProfilePersonalDataForm: FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { user, isUpdateUserInfoFetching, updateUserDataField } = useAuth(
    (state) => state,
  );
  const { t } = useTranslation();
  const currentUser = user as IUser;

  const form = useForm({
    initialValues: {
      name: currentUser.name,
    },

    validate: {
      name: (value) => (value ? null : 'Введите имя'),
    },
  });

  const submitUpdateUserData = async (): Promise<void> => {
    await updateUserDataField({ name: form.values.name }, t);
    setIsEditMode(false);
  };

  if (isEditMode)
    return (
      <Container m={0} w={250} pos="relative">
        <form onSubmit={form.onSubmit(submitUpdateUserData)}>
          <TextInput
            label={t('profile.name')}
            placeholder="Ivan Ivanov"
            mb="sm"
            disabled={isUpdateUserInfoFetching}
            {...form.getInputProps('name')}
          />
          <Text weight={500} size={14}>
            {t('profile.phone')}
          </Text>
          <Text mb="sm">{currentUser.phone}</Text>

          <Button type="submit" loading={isUpdateUserInfoFetching}>
            {t('profile.save')}
          </Button>
        </form>
      </Container>
    );

  return (
    <Container m={0} w={250}>
      <Text weight={500} size={14}>
        {t('profile.name')}
      </Text>
      <Text mb="sm">{currentUser.name}</Text>
      <Text weight={500} size={14}>
        {t('profile.phone')}
      </Text>
      <Text mb="sm">{currentUser.phone}</Text>

      <Button onClick={() => setIsEditMode(true)}>{t('profile.update')}</Button>
    </Container>
  );
};
