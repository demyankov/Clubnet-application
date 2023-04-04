import { FC, useState } from 'react';

import {
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Stack,
  Loader,
  createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getAuth, updatePassword, User } from 'firebase/auth';

const useStyles = createStyles((theme) => ({
  loader: {
    position: 'absolute',
    backgroundColor: theme.colorScheme === 'dark' ? '#00000080' : '#ffffff80',
    zIndex: 10,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export const ResetPasswordForm: FC<PaperProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { classes } = useStyles();

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
      {isLoading && (
        <div className={classes.loader}>
          <Loader size="xl" />
        </div>
      )}
      <Text size="lg" weight={500}>
        Reset your password
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
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
          {isSuccess && <Text c="teal.4">Password successfully changed!</Text>}
          {isError && (
            <Text c="#fa5252">Password not changed. Re-login and try again</Text>
          )}
        </Stack>

        <Group position="center" mt="xl">
          <Button type="submit" radius="xl" disabled={isLoading}>
            Reset
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
