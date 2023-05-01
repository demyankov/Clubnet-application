import { FC, useState } from 'react';

import { createStyles, Paper, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { SIGN_IN_STEP_VIEWS } from 'components/Login/config';
import { SignInSteps } from 'components/Login/types';

const useStyles = createStyles(() => ({
  authForm: {
    paddingTop: '2.5rem',
    maxWidth: '26.25rem',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const Login: FC = () => {
  const { classes } = useStyles();
  const [currentStep, setCurrentStep] = useState<SignInSteps>(
    SignInSteps.EnterPhoneNumber,
  );
  const { t } = useTranslation();

  const StepComponent = SIGN_IN_STEP_VIEWS[currentStep];

  return (
    <div className={classes.authForm}>
      <Paper radius="md" p="xl" withBorder pos="relative">
        <Text size="lg" weight={500} ta="center">
          {t('form.signin-header')}
        </Text>

        <StepComponent setCurrentStep={setCurrentStep} />

        <div id="captcha" />
      </Paper>
    </div>
  );
};

export default Login;
