import { FC } from 'react';

import { Button, createStyles, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { LoginViewsProps } from 'components/Login/types';
import { useAuth } from 'store/store';

const useStyles = createStyles(() => ({
  wrapper: {
    height: '90px', // Set a fixed height to prevent layout jump
  },
}));

export const LoginSetNickName: FC<LoginViewsProps> = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const { isFetching, nickNameExists } = useAuth((state) => state.signIn);

  const { values, getInputProps, onSubmit, setFieldError } = useForm({
    initialValues: {
      nickName: '',
    },
  });

  const handleSubmit = ({ nickName }: typeof values): void => {
    nickNameExists(nickName, setFieldError);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <TextInput
        my="xs"
        name="nickName"
        label={t('form.setNickname')}
        required
        autoFocus
        wrapperProps={{ className: classes.wrapper }}
        description={t('form.nicknameNote')}
        placeholder={t('form.yourNickname') as string}
        {...getInputProps('nickName')}
      />

      <Group position="center" mt="xl">
        <Button loading={isFetching} type="submit" radius="xl">
          {t('form.toSetNickname')}
        </Button>
      </Group>
    </form>
  );
};
