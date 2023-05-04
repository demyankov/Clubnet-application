import { Dispatch, FC, SetStateAction } from 'react';

import { PinInput, Group, Button, Stack, LoadingOverlay } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { BiArrowBack } from 'react-icons/bi';

import { SignInSteps } from '../types';

import { useAuth } from 'store/store';

type Props = {
  setCurrentStep: Dispatch<SetStateAction<SignInSteps>>;
};

const codeLength = 6;

export const LoginConfirmCode: FC<Props> = ({ setCurrentStep }) => {
  const {
    signIn: { isFetching, signIn },
  } = useAuth((state) => state);
  const { t } = useTranslation();

  const handlePrevStep = (): void => {
    setCurrentStep(SignInSteps.EnterPhoneNumber);
  };

  const handleChangeConfirmCode = async (code: string): Promise<void> => {
    const isValid = code.length === codeLength;

    if (!isValid) {
      return;
    }

    await signIn(code, t);
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
        />
      </Stack>

      <Group position="center" mt="xl">
        <Button
          leftIcon={<BiArrowBack size="1.2rem" />}
          type="button"
          radius="xl"
          onClick={handlePrevStep}
          disabled={isFetching}
        >
          {t('form.phoneAgain')}
        </Button>
      </Group>
    </>
  );
};
