import { Dispatch, FC, SetStateAction } from 'react';

import { PinInput, Group, Button, Stack, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { SignInSteps } from 'components';
import { errorNotification, successNotification } from 'helpers';
import { useAuth } from 'store/store';

type PropsType = {
  setCurrentStep: Dispatch<SetStateAction<SignInSteps>>;
};

export const OTPForm: FC<PropsType> = ({ setCurrentStep }: PropsType) => {
  const {
    signIn: { isFetching, error, signIn },
  } = useAuth((state) => state);
  const { t } = useTranslation();

  const OPTForm = useForm({
    initialValues: {
      OTP: '',
    },
  });

  const handlePrevStep = (): void => {
    setCurrentStep(SignInSteps.EnterPhoneNumber);
  };

  const onSubmitOTP = async (): Promise<void> => {
    await signIn(OPTForm.values.OTP);
    if (error) {
      const message = 'notifications.verification-error';

      errorNotification(t, message);

      return;
    }

    const message = 'notifications.signin-success';

    successNotification(t, message);
  };

  return (
    <form onSubmit={OPTForm.onSubmit(onSubmitOTP)}>
      <LoadingOverlay visible={isFetching} overlayBlur={0.1} />

      <Stack>
        <PinInput
          required
          autoFocus
          oneTimeCode
          length={6}
          radius="md"
          mt="md"
          mx="auto"
          {...OPTForm.getInputProps('OTP')}
        />
      </Stack>

      <Group position="center" mt="xl">
        <>
          <Button
            type="button"
            radius="xl"
            onClick={handlePrevStep}
            disabled={isFetching}
          >
            {t('form.phone-again')}
          </Button>
          <Button type="submit" radius="xl" disabled={isFetching}>
            {t('form.send')}
          </Button>
        </>
      </Group>
    </form>
  );
};
