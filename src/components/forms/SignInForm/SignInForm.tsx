import { FC, useState } from 'react';

import { Text, Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { PhoneForm, OTPForm } from 'components';

export enum SignInSteps {
  EnterPhoneNumber,
  ConfirmCode,
}

export const SignInForm: FC = () => {
  const [currentStep, setCurrentStep] = useState<SignInSteps>(
    SignInSteps.EnterPhoneNumber,
  );
  const { t } = useTranslation();

  const SIGN_IN_STEP_VIEWS = {
    [SignInSteps.EnterPhoneNumber]: PhoneForm,
    [SignInSteps.ConfirmCode]: OTPForm,
  };

  const StepComponent = SIGN_IN_STEP_VIEWS[currentStep];

  return (
    <Paper radius="md" p="xl" withBorder pos="relative">
      <Text size="lg" weight={500} ta="center">
        {t('form.signin-header')}
      </Text>

      <StepComponent setCurrentStep={setCurrentStep} />
      <div id="captcha" />
    </Paper>
  );
};
