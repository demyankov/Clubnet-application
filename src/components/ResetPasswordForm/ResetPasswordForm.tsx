import { FC, useState } from 'react';

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
import { getAuth, updatePassword, User } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

import { LoaderScreen } from 'components';

export const ResetPasswordForm: FC<PaperProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
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
    setIsLoading(true);
    form.reset();
    const auth = getAuth();
    const user = auth.currentUser as User;

    updatePassword(user, form.values.password)
      .then(() => {
        setIsLoading(false);
        setIsSuccess(true);
        setIsError(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsSuccess(false);
        setIsError(true);
      });
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props} pos="relative">
      {isLoading && <LoaderScreen />}
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
          {isSuccess && <Text c="teal.4">{t('form.changed')}</Text>}
          {isError && <Text c="#fa5252">{t('form.not-changed')}</Text>}
        </Stack>

        <Group position="center" mt="xl">
          <Button type="submit" radius="xl" disabled={isLoading}>
            {t('form.reset')}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
