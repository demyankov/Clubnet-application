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
import { errorNotification, successNotification } from 'helpers';
import { useStore } from 'store';

export const ResetPasswordForm: FC<PaperProps> = (props) => {
  const { reset, isResetFetching } = useStore((state) => state);
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validate: {
      password: (value) => (value.length < 6 ? t('form.invalid-pass').toString() : null),
      confirmPassword: (value, values) =>
        value === values.password ? null : t('form.invalid-confirm').toString(),
    },
  });

  const handleSubmit = async (): Promise<void> => {
    const isError = await reset(form.values.password);

    if (isError) {
      const title = t('form.error-title').toString();
      const message = t('form.not-changed').toString();

      errorNotification(title, message);
    } else {
      const title = t('form.success-title').toString();
      const message = t('form.changed').toString();

      successNotification(title, message);
    }

    form.reset();
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props} pos="relative">
      {isResetFetching && <LoaderScreen />}
      <Text size="lg" weight={500}>
        {t('form.welcome-reset')}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <PasswordInput
            required
            label={t('form.pass').toString()}
            placeholder={t('form.your-pass').toString()}
            radius="md"
            {...form.getInputProps('password')}
          />

          <PasswordInput
            required
            label={t('form.confirm').toString()}
            placeholder={t('form.confirm').toString()}
            radius="md"
            {...form.getInputProps('confirmPassword')}
          />
        </Stack>

        <Group position="center" mt="xl">
          <Button type="submit" radius="xl" disabled={isResetFetching}>
            {t('form.reset')}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
