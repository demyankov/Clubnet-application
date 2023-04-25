import { Dispatch, FC, SetStateAction } from 'react';

import { TextInput, Group, Button, Stack, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { SignInSteps } from 'components';
import { errorNotification } from 'helpers';
import { useAuth } from 'store/store';

type PropsType = {
  setCurrentStep: Dispatch<SetStateAction<SignInSteps>>;
};

export const PhoneForm: FC<PropsType> = ({ setCurrentStep }: PropsType) => {
  const {
    getOTP: { isFetching, error, sendOTP },
  } = useAuth((state) => state);
  const { t } = useTranslation();

  const phoneForm = useForm({
    initialValues: {
      phone: '',
    },

    validate: {
      phone: (value) =>
        /^\+[1-9]\d{1,14}$/.test(value) ? null : 'Wrong phone number format!',
    },
  });

  const onSubmitPhone = async (): Promise<void> => {
    await sendOTP(phoneForm.values.phone);
    if (error) {
      const message = 'notifications.phone-error';

      errorNotification(t, message);

      return;
    }
    setCurrentStep(SignInSteps.ConfirmCode);
  };

  return (
    <form onSubmit={phoneForm.onSubmit(onSubmitPhone)}>
      <LoadingOverlay visible={isFetching} overlayBlur={0.1} />

      <Stack>
        <TextInput
          required
          label={t('form.your-phone')}
          description={t('form.phone-format')}
          placeholder="+1234234234"
          radius="md"
          mt="md"
          {...phoneForm.getInputProps('phone')}
        />
      </Stack>

      <Group position="center" mt="xl">
        <Button type="submit" radius="xl" disabled={isFetching}>
          {t('form.send-sms')}
        </Button>
      </Group>
    </form>
  );
};
