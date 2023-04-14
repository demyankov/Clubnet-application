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
import { useStore } from 'store';

export const RegisterForm: FC<PaperProps> = (props) => {
  const { register, isRegFetching, isRegError } = useStore((state) => state);
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length < 6 ? 'Password should include at least 6 characters' : null,
      confirmPassword: (val, values) =>
        val === values.password ? null : "Passwords don't match",
    },
  });

  const handleSubmit = (): void => {
    const { email, password } = form.values;

    register(email, password);

    if (isRegError) {
      form.setErrors({
        wrongEmail: (
          <Trans i18nKey="form.already-email">Email {{ email }} already registered</Trans>
        ),
      });
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props} pos="relative">
      {isRegFetching && <LoaderScreen />}
      <Text size="lg" weight={500}>
        {t('form.welcome-reg')}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label={t('form.email').toString()}
            placeholder="john_doe@mail.org"
            value={form.values.email}
            onChange={(event) => {
              form.clearErrors();
              form.setFieldValue('email', event.currentTarget.value);
            }}
            error={form.errors.email && t('form.invalid-email').toString()}
            radius="md"
          />

          <PasswordInput
            required
            label={t('form.pass').toString()}
            placeholder={t('form.your-pass').toString()}
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={form.errors.password && t('form.invalid-pass').toString()}
            radius="md"
          />

          <PasswordInput
            required
            label={t('form.confirm').toString()}
            placeholder={t('form.confirm').toString()}
            value={form.values.confirmPassword}
            onChange={(event) =>
              form.setFieldValue('confirmPassword', event.currentTarget.value)
            }
            error={form.errors.confirmPassword && t('form.invalid-confirm').toString()}
            radius="md"
          />
          {form.errors && <Text c="#fa5252">{form.errors.wrongEmail}</Text>}
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
