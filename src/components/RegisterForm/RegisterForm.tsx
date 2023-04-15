import { FC } from 'react';

import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Anchor,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoaderScreen } from 'components';
import { Paths } from 'constants/paths';
import { errorNotification, successNotification } from 'helpers';
import { useStore } from 'store';

export const RegisterForm: FC<PaperProps> = (props) => {
  const { register, isRegFetching } = useStore((state) => state);
  const { t } = useTranslation();

  const { values, onSubmit, getInputProps } = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : t('form.invalid-email').toString(),
      password: (value) => (value.length < 6 ? t('form.invalid-pass').toString() : null),
      confirmPassword: (value, values) =>
        value === values.password ? null : t('form.invalid-confirm').toString(),
    },
  });

  const handleSubmit = async (): Promise<void> => {
    const { email, password } = values;
    const isError = await register(email, password);

    if (isError) {
      const title = t('form.error-title').toString();
      const message = (
        <Trans i18nKey="form.already-email">Email {{ email }} already registered</Trans>
      );

      errorNotification(title, message);
    } else {
      const title = t('form.success-title').toString();
      const message = t('form.register-success').toString();

      successNotification(title, message);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props} pos="relative">
      {isRegFetching && <LoaderScreen />}
      <Text size="lg" weight={500}>
        {t('form.welcome-reg')}
      </Text>

      <form onSubmit={onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label={t('form.email').toString()}
            placeholder="john_doe@mail.org"
            radius="md"
            {...getInputProps('email')}
          />

          <PasswordInput
            required
            label={t('form.pass').toString()}
            placeholder={t('form.your-pass').toString()}
            radius="md"
            {...getInputProps('password')}
          />

          <PasswordInput
            required
            label={t('form.confirm').toString()}
            placeholder={t('form.confirm').toString()}
            radius="md"
            {...getInputProps('confirmPassword')}
          />
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component={Link}
            to={Paths.login}
            type="button"
            color="dimmed"
            size="xs"
          >
            {t('form.already')}
          </Anchor>
          <Button type="submit" radius="xl" disabled={isRegFetching}>
            {t('form.register')}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
