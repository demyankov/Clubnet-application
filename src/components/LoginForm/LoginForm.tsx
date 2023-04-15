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
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoaderScreen } from 'components';
import { Paths } from 'constants/paths';
import { errorNotification, successNotification } from 'helpers';
import { useStore } from 'store';

export const LoginForm: FC<PaperProps> = (props) => {
  const { login, isLoginFetching } = useStore((state) => state);
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : t('form.invalid-email').toString(),
      password: (value) => (value.length < 6 ? t('form.invalid-pass').toString() : null),
    },
  });

  const handleSubmit = async (): Promise<void> => {
    form.clearErrors();
    const isLoginError = await login(form.values.email, form.values.password);

    if (isLoginError) {
      const title = t('form.error-title').toString();
      const message = t('form.login-error').toString();

      errorNotification(title, message);
    } else {
      const title = t('form.success-title').toString();
      const message = t('form.login-success').toString();

      successNotification(title, message);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props} pos="relative">
      {isLoginFetching && <LoaderScreen />}
      <Text size="lg" weight={500}>
        {t('form.welcome-login')}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label={t('form.email').toString()}
            placeholder="john_doe@mail.org"
            radius="md"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            required
            label={t('form.pass').toString()}
            placeholder={t('form.your-pass').toString()}
            radius="md"
            {...form.getInputProps('password')}
          />
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component={Link}
            to={Paths.register}
            type="button"
            color="dimmed"
            size="xs"
          >
            {t('form.no-acc')}
          </Anchor>
          <Button type="submit" radius="xl">
            {t('form.login')}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
