import { FC } from 'react';

import { Input, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';

import { LoginViewsProps } from 'components/Login/types';
import { useAuth } from 'store/store';

export const LoginEnterPhoneNumber: FC<LoginViewsProps> = ({ setTempPhone }) => {
  const { isFetching, isError, sendOTP } = useAuth((state) => state.signIn);

  const { t } = useTranslation();

  const { values, errors, setFieldValue, onSubmit, getInputProps } = useForm({
    initialValues: {
      phone: '',
    },

    validate: {
      phone: (value) =>
        /^\+375(25|29|33|44)\d{7}$/.test(value) ? null : t('form.phoneFormat'),
    },
  });

  const onSubmitPhone = async (): Promise<void> => {
    const { phone } = values;

    await sendOTP(phone);

    if (!isError) {
      setTempPhone(phone);
    }
  };

  const handleOnFocus = (): void => {
    if (values.phone.length <= 4) {
      setFieldValue('phone', '+375');
    }
  };

  const handleOnPaste = async (): Promise<void> => {
    // user has to allow access to clipboard
    const paste = await navigator.clipboard.readText();

    setFieldValue('phone', paste.trim().slice(-9));
  };

  return (
    <form onSubmit={onSubmit(onSubmitPhone)}>
      <LoadingOverlay visible={isFetching} overlayBlur={0.1} />

      <Input.Wrapper
        id="phone-input"
        label={t('form.yourPhone')}
        required
        mt="xs"
        inputMode="tel"
        onFocus={handleOnFocus}
        onPaste={handleOnPaste}
      >
        <Input
          component={IMaskInput}
          mask="+375000000000"
          id="phone-input"
          required
          mt="xs"
          placeholder="+375251234567"
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
