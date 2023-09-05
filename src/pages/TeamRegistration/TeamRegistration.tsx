import { FC, useState } from 'react';

import { Button, createStyles, Group, Modal, Stepper, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { activeStepByDefault } from 'constants/activeStepByDefault';
import { registrationTeamSteps } from 'pages/TeamRegistration/config';
import { useTeams, useTournaments } from 'store/store';

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    marginTop: theme.spacing.md,
  },
}));

const Tournaments: FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const { classes } = useStyles();
  const [activeStep, setActiveStep] = useState(activeStepByDefault);
  const { currentTeam } = useTeams((store) => store);
  const { registerTeam, selectedTeamId } = useTournaments((state) => state);

  const isBackButtonDisabled = activeStep === 0;
  const isNextButtonDisabled = !selectedTeamId;
  const countOfSteps = registrationTeamSteps.length;

  const handleRegisterTeam = (): void => {
    if (!currentTeam || !id) {
      return;
    }

    registerTeam(currentTeam, id, close, navigate);
  };

  const handleGoBack = (): void => navigate(-1);

  const nextStep = (): void => {
    if (activeStep === countOfSteps - 1) {
      open();

      return;
    }
    setActiveStep((current) => current + 1);
  };

  const prevStep = (): void =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Group mt="md">
        <Button variant="default" onClick={handleGoBack}>
          {t('shared.btnGoBack')}
        </Button>
      </Group>
      <Group mt="md" position="apart">
        <Title mb="md" order={2}>
          {t('tournaments.tournamentRegistration')}
        </Title>
        <div className={classes.wrapper}>
          <Stepper active={activeStep} breakpoint="sm">
            {registrationTeamSteps.map(
              ({ id, label, description, children: Children }) => (
                <Stepper.Step key={id} label={t(label)} description={t(description)}>
                  <Children />
                </Stepper.Step>
              ),
            )}
          </Stepper>
          <Group position="center" mt="xl">
            <Button variant="default" onClick={prevStep} disabled={isBackButtonDisabled}>
              {t('modals.btnBack')}
            </Button>
            <Button onClick={nextStep} disabled={isNextButtonDisabled}>
              {t('modals.btnNext')}
            </Button>
          </Group>

          <Modal
            opened={opened}
            onClose={close}
            title={t('modals.registrationTeamConfirm')}
            centered
          >
            <Text>{t('modals.registrationTeamMessage')}</Text>
            <Group position="center" mt="xl">
              <Button variant="default" onClick={close}>
                {t('modals.btnBack')}
              </Button>
              <Button onClick={handleRegisterTeam}>{t('modals.btnRegister')}</Button>
            </Group>
          </Modal>
        </div>
      </Group>
    </>
  );
};

export default Tournaments;
