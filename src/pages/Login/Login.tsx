import { FC, useState, useRef } from 'react';

import { createStyles, Paper, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { SIGN_IN_STEP_VIEWS } from 'components/Login/config';
import { useAuth } from 'store/store';

const useStyles = createStyles(() => ({
  authForm: {
    maxWidth: '26.25rem',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const Login: FC = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const { currentStep } = useAuth((state) => state.signIn);

  const [tempPhone, setTempPhone] = useState<string>('');

  const widgetRef = useRef<HTMLDivElement>(null);

  const StepComponent = SIGN_IN_STEP_VIEWS[currentStep];

  const resetRecaptchaWidget = (): void => {
    (widgetRef.current as HTMLDivElement).innerHTML = '<div id="captcha" />';
  };

  return (
    <div className={classes.authForm}>
      <Paper radius="md" p="xl" withBorder pos="relative">
        <Text size="lg" weight={500} ta="center">
          {t('form.signinHeader')}
        </Text>

        <StepComponent
          tempPhone={tempPhone}
          setTempPhone={setTempPhone}
          resetRecaptchaWidget={resetRecaptchaWidget}
        />

        <div ref={widgetRef}>
          <div id="captcha" />
        </div>
      </Paper>
    </div>
  );
};

export default Login;
