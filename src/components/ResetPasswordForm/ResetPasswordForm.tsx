import { FC } from 'react';

import {
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { LoaderScreen } from 'components';
import { useAuth } from 'store';

export const ResetPasswordForm: FC<PaperProps> = (props) => {
  const { update, isFetching, isError, isUpdated } = useAuth((state) => ({
    isFetching: state.isFetching,
    isError: state.isError,
    isUpdated: state.isUpdated,
    update: state.update,
  }));
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validate: {
      password: (val) =>
        val.length < 6 ? 'Password should include at least 6 characters' : null,
      confirmPassword: (val, values) =>
        val === values.password ? null : "Passwords don't match",
    },
  });

  const handleSubmit = (): void => {
    update(form.values.password);
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props} pos="relative">
      {isFetching && <LoaderScreen />}
      <Text size="lg" weight={500}>
        {t('form.welcome-reset')}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
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
          {isUpdated && <Text c="teal.4">{t('form.changed')}</Text>}
          {isError && <Text c="#fa5252">{t('form.not-changed')}</Text>}
        </Stack>

        <Group position="center" mt="xl">
          <Button type="submit" radius="xl" disabled={isFetching}>
            {t('form.reset')}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
