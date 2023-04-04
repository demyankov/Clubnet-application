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
  Loader,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import s from 'components/form.module.css';
import { setUser } from 'store/userSlice';

export const RegisterForm: FC<PaperProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    setIsLoading(true);
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, form.values.email, form.values.password)
      .then(async ({ user }) => {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: await user.getIdToken(),
          }),
        );
        setIsLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error.code;

        if (errorCode === 'auth/email-already-in-use') {
          form.setErrors({ wrongEmail: `Email ${form.values.email} already registered` });
        }
      });
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props} pos="relative">
      {isLoading && (
        <div className={s.loader}>
          <Loader size="xl" />
        </div>
      )}
      <Text size="lg" weight={500}>
        Welcome to App, register with
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="john_doe@mail.org"
            value={form.values.email}
            onChange={(event) => {
              form.clearErrors();
              form.setFieldValue('email', event.currentTarget.value);
            }}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={
              form.errors.password && 'Password should include at least 6 characters'
            }
            radius="md"
          />

          <PasswordInput
            required
            label="Confirm password"
            placeholder="Confirm password"
            value={form.values.confirmPassword}
            onChange={(event) =>
              form.setFieldValue('confirmPassword', event.currentTarget.value)
            }
            error={form.errors.confirmPassword && "Passwords don't match"}
            radius="md"
          />
          {form.errors && <Text c="#fa5252">{form.errors.wrongEmail}</Text>}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor component={Link} to="/login" type="button" color="dimmed" size="xs">
            Already have an account? Login
          </Anchor>
          <Button type="submit" radius="xl" disabled={isLoading}>
            Register
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
