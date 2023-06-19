import { FC } from 'react';

import { Input, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';

import { LoginViewsProps } from 'components/Login/types';
import { formatPhoneNumber } from 'helpers/formatters';
import { useAuth } from 'store/store';

export const LoginEnterPhoneNumber: FC<LoginViewsProps> = ({ setTempPhone }) => {
  const { isFetching, isError, sendSmsCode } = useAuth((state) => state.signIn);

  const { t } = useTranslation();

  const {
    values: { phone },
    errors,
    onSubmit,
    getInputProps,
  } = useForm({
    initialValues: {
      phone: '',
    },

    validate: {
      phone: (value) => {
        if (!value) {
          return t('modals.requiredField');
        }

        const processedPhone = formatPhoneNumber(value);
        const prefixRegex = /^\+375\s?(25|29|33|44)/;

        if (!prefixRegex.test(processedPhone)) {
          return t('form.phoneFormat');
        }

        return null;
      },
    },
  });

  const handleSubmit = (): void => {
    const processedPhone = formatPhoneNumber(phone);

    sendSmsCode(processedPhone);

    if (!isError) {
      setTempPhone(processedPhone);
    }
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <LoadingOverlay visible={isFetching} overlayBlur={0.1} />

      <Input.Wrapper
        id="phone-input"
        label={t('form.yourPhone')}
        withAsterisk
        mt="xs"
        inputMode="tel"
      >
        <Input
          component={IMaskInput}
          mask="+375 (00) 000-00-00"
          id="phone-input"
          mt="xs"
          placeholder={t('login.phonePlaceholder')}
          {...getInputProps('phone')}
        />
        <Input.Error>{errors.phone}</Input.Error>
      </Input.Wrapper>

      <Group position="center" mt="xl">
        <Button type="submit" radius="xl" disabled={isFetching}>
          {t('form.sendSMS')}
        </Button>
      </Group>
    </form>
  );
};
