import { FC, useState } from 'react';

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
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { LoaderScreen } from 'components';
import { Paths } from 'constants/paths';
import { setUser } from 'store/slices/userSlice';

export const LoginForm: FC<PaperProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length < 6 ? 'Password should include at least 6 characters' : null,
    },
  });

  const handleSubmit = (): void => {
    form.clearErrors();
    setIsLoading(true);
    const auth = getAuth();

    signInWithEmailAndPassword(auth, form.values.email, form.values.password)
      .then(async ({ user }) => {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: await user.getIdToken(),
          }),
        );
        setIsLoading(false);
        navigate(Paths.home);
      })
      .catch(() => {
        setIsLoading(false);
        form.setErrors({ common: t('form.invalid-email-pass').toString() });
      });
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props} pos="relative">
      {isLoading && <LoaderScreen />}
      <Text size="lg" weight={500}>
        {t('form.welcome-login')}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label={t('form.email').toString()}
            placeholder="john_doe@mail.org"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
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
          {form.errors && <Text c="#fa5252">{form.errors.common}</Text>}
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
