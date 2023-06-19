import { FC, useEffect, useState } from 'react';

import { Box, Container, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

import {
  BookingsEstablishment,
  ADD_ADDRESS_STEPS,
  AddAddressSteps,
  IFormValues,
} from 'components';
import { initialValues } from 'constants/initialValues';
import { useBookings } from 'store/store';

const Bookings: FC = () => {
  const [currentStep, setCurrentStep] = useState<AddAddressSteps>(
    AddAddressSteps.Address,
  );
  const [formValues, setFormValues] = useState<IFormValues>(initialValues);
  const [opened, { open, close }] = useDisclosure(false);
  const { currentEstablishment, getEstablishments } = useBookings(
    (state) => state.establishmentActions,
  );
  const { t } = useTranslation();

  useEffect(() => {
    getEstablishments();
  }, [getEstablishments]);

  const handleOnClose = (): void => {
    close();
    setCurrentStep(AddAddressSteps.Address);
  };

  const StepComponent = ADD_ADDRESS_STEPS[currentStep];

  return (
    <Box pt="3rem">
      <Modal
        centered
        opened={opened}
        onClose={handleOnClose}
        title={
          currentEstablishment
            ? t('establishments.addAddress')
            : t('establishments.createEstablishment')
        }
      >
        <StepComponent
          formValues={formValues}
          setFormValues={setFormValues}
          setCurrentStep={setCurrentStep}
          handleOnClose={handleOnClose}
        />
      </Modal>

      <Container size="md">
        <BookingsEstablishment open={open} />
      </Container>
    </Box>
  );
};

export default Bookings;
