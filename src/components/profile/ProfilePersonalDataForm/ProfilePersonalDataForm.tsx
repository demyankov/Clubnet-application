import { FC, useState } from 'react';

import { Button, Container, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { BsCheck } from 'react-icons/bs';
import { RiCloseCircleFill } from 'react-icons/ri';

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
      name: currentUser.name || '',
    },

    validate: {
      name: (value) => (value ? null : 'Введите имя'),
    },
  });

  const submitUpdateUserData = async (): Promise<void> => {
    await updateUserDataField({ name: form.values.name });
    setIsEditMode(false);
  };

  const handleCancel = (): void => {
    setIsEditMode(false);
  };

  if (isEditMode)
    return (
      <Container m={0} w={250} pos="relative">
        <Text size="lg" fw={700} td="underline">
          {currentUser.nickName}
        </Text>
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

          <Group>
            <Button type="submit" loading={isUpdateUserInfoFetching}>
              <BsCheck size="1.2rem" />
            </Button>

            <Button onClick={handleCancel}>
              <RiCloseCircleFill size="1.2rem" />
            </Button>
          </Group>
        </form>
      </Container>
    );

  return (
    <Container m={0} w={250}>
      <Text size="lg" fw={700} td="underline">
        {currentUser.nickName}
      </Text>
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
