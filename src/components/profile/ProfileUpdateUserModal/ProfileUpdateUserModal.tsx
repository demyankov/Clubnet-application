import { FC } from 'react';

import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

import { requiredFieldsGenerator } from 'helpers/requiredFieldsGenerator';
import { useAuth } from 'store/store';
import { IUser } from 'store/types';

export const ProfileUpdateUserModal: FC = () => {
  const { user, isUpdateUserInfoFetching, updateUserDataField } = useAuth(
    (state) => state,
  );

  const { t } = useTranslation();

  const currentUser = user as IUser;

  interface IFormValues {
    name: string;
  }

  const form = useForm<IFormValues>({
    initialValues: {
      name: currentUser.name || '',
    },

    validate: (values) => requiredFieldsGenerator<IFormValues>(values),
  });

  const submitUpdateUserData = (): void => {
    updateUserDataField({ name: form.values.name });
    modals.close('ProfileUpdateUserModal');
  };

  return (
    <form onSubmit={form.onSubmit(submitUpdateUserData)}>
      <TextInput
        label={t('profile.name')}
        placeholder="Ivan Ivanov"
        mb="sm"
        disabled={isUpdateUserInfoFetching}
        {...form.getInputProps('name')}
      />

      <Button type="submit" loading={isUpdateUserInfoFetching}>
        {t('profile.update')}
      </Button>
    </form>
  );
};
