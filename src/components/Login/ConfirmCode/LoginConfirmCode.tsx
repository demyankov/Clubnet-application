import { FC } from 'react';

import { PinInput, Group, Button, Stack, LoadingOverlay, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BiArrowBack } from 'react-icons/bi';

import { LoginViewsProps, SignInSteps } from 'components/Login/types';
import { useTimer } from 'hooks';
import { useAuth } from 'store/store';

const codeLength = 6;

export const LoginConfirmCode: FC<LoginViewsProps> = ({
  tempPhone,
  resetRecaptchaWidget,
}) => {
  const { t } = useTranslation();
  const { isFetching, isError, signIn, setCurrentStep, sendOTP } = useAuth(
    (state) => state.signIn,
  );

  const { seconds, isFinished, restart } = useTimer();

  const handlePrevStep = (): void => {
    resetRecaptchaWidget();
    setCurrentStep(SignInSteps.EnterPhoneNumber);
  };

  const handleChangeConfirmCode = (code: string): void => {
    const isValid = code.length === codeLength;

    if (!isValid) {
      return;
    }

    signIn(code);
  };

  const handleSendCode = async (): Promise<void> => {
    resetRecaptchaWidget();

    await sendOTP(tempPhone);

    restart();
  };

  return (
    <>
      <LoadingOverlay visible={isFetching} overlayBlur={0.1} />

      <Stack>
        <PinInput
          required
          autoFocus
          oneTimeCode
          type="number"
          length={codeLength}
          inputMode="numeric"
          radius="md"
          mt="md"
          mx="auto"
          onChange={handleChangeConfirmCode}
          error={isError}
        />
        {isError && (
          <Text c="red" size="xs" ta="center">
            {t('form.wrongCode')}
          </Text>
        )}
      </Stack>

      <Group position="center" mt="xl">
        <Button type="button" radius="xl" onClick={handlePrevStep} disabled={isFetching}>
          <BiArrowBack size="1.2rem" />
        </Button>

        <Button
          disabled={!isFinished}
          loading={isFetching}
          radius="xl"
          onClick={handleSendCode}
        >
          {seconds} {t('form.smsAgain')}
        </Button>
      </Group>
    </>
  );
};
