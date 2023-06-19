import { FC, useState, useRef, useEffect } from 'react';

import { createStyles, Text, Card } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { SIGN_IN_STEP_VIEWS } from 'components/Login/config';
import { Paths } from 'constants/paths';
import { useAuth } from 'store/store';

const useStyles = createStyles(() => ({
  authForm: {
    width: '100%',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const Login: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { classes } = useStyles();

  const { currentStep, isCompletedRegistration } = useAuth((state) => state.signIn);

  const [tempPhone, setTempPhone] = useState<string>('');

  const widgetRef = useRef<HTMLDivElement>(null);

  const StepComponent = SIGN_IN_STEP_VIEWS[currentStep];

  const resetRecaptchaWidget = (): void => {
    (widgetRef.current as HTMLDivElement).innerHTML =
      '<div id="captcha"  style="visibility: hidden;"/>';
  };

  useEffect(() => {
    if (isCompletedRegistration) {
      navigate(Paths.home);
    }
  }, [isCompletedRegistration, navigate]);

  return (
    <Card className={classes.authForm} radius="md" p="xl" withBorder maw="26.25rem">
      <Text size="lg" weight={500} ta="center">
        {t('form.signinHeader')}
      </Text>

      <StepComponent
        tempPhone={tempPhone}
        setTempPhone={setTempPhone}
        resetRecaptchaWidget={resetRecaptchaWidget}
      />

      <div ref={widgetRef}>
        <div id="captcha" style={{ visibility: 'hidden' }} />
      </div>
    </Card>
  );
};

export default Login;
