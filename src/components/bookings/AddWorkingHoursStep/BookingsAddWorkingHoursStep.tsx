import { FC } from 'react';

import { Button, Center, Flex, Text, UnstyledButton, createStyles } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  BookingsWorkingDaysInputs,
  AddAddressSteps,
  AddressStepsProps,
} from 'components';
import { initialValues } from 'constants/initialValues';
import { weekdays } from 'constants/weekdays';
import { IWorkingHours, WeekDays } from 'store/slices/bookings/types';
import { useBookings } from 'store/store';

const useStyles = createStyles((theme) => ({
  setDays: {
    fontSize: '0.8rem',
    opacity: '0.6',
    textDecoration: 'underline dotted',
    textUnderlineOffset: '0.15em',
  },

  error: {
    color: theme.colors.red,
  },
}));

export const BookingsAddWorkingHoursStep: FC<AddressStepsProps> = ({
  formValues,
  setCurrentStep,
  setFormValues,
  handleOnClose,
}) => {
  const {
    establishmentActions: { addEstablishmentAndAddress },
    addressActions: { addAddress },
  } = useBookings((state) => state);
  const { t } = useTranslation();
  const { classes } = useStyles();

  const workingHours = {} as IWorkingHours;

  weekdays.forEach((day) => {
    workingHours[day] = {
      isAvailable: false,
      start: '00:00',
      finish: '00:00',
    };
  });

  const { values, errors, onSubmit, getInputProps, setFieldValue } = useForm({
    initialValues: {
      workingHours,
    },

    validate: (values) => {
      let isValid = false;
      let workingHours = null;

      weekdays.forEach((day) => {
        if (values.workingHours[day].isAvailable) {
          isValid = true;
        }
      });

      if (!isValid) {
        workingHours = t('address.setWorkingHours');
      }

      return { workingHours };
    },
  });

  const handleSetDaily = (): void => {
    weekdays.forEach((day) => {
      setFieldValue(`workingHours.${day}.isAvailable`, true);
    });
  };

  const handleSetMonFri = (): void => {
    weekdays.forEach((day) => {
      if (day === WeekDays.Sat || day === WeekDays.Sun) {
        setFieldValue(`workingHours.${day}.isAvailable`, false);
      } else {
        setFieldValue(`workingHours.${day}.isAvailable`, true);
      }
    });
  };

  const handleApplyToAll = (): void => {
    const { workingHours } = values;

    if (workingHours[WeekDays.Mon].isAvailable) {
      const { start, finish } = workingHours[WeekDays.Mon];

      weekdays.forEach((day) => {
        setFieldValue(`workingHours.${day}.start`, start);
        setFieldValue(`workingHours.${day}.finish`, finish);
      });
    }
  };

  const handleSubmit = (): void => {
    handleOnClose();

    const { name, ...addressData } = formValues;
    const { workingHours } = values;

    if (name) {
      addEstablishmentAndAddress({ ...formValues, workingHours });
    } else {
      addAddress({ ...addressData, workingHours });
    }

    setFormValues(initialValues);
  };

  const handleGoBack = (): void => {
    setCurrentStep(AddAddressSteps.Address);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Flex justify="space-between">
        <Text size="sm" mb="xs" color="gray">
          {t('establishments.workingHours')}
        </Text>

        <Flex>
          <UnstyledButton className={classes.setDays} onClick={handleSetDaily} mr="lg">
            {t('workingDays.daily')}
          </UnstyledButton>
          <UnstyledButton className={classes.setDays} onClick={handleSetMonFri}>
            {t('workingDays.monFri')}
          </UnstyledButton>
        </Flex>
      </Flex>
      <BookingsWorkingDaysInputs
        workingHours={values.workingHours}
        getInputProps={getInputProps}
        handleApplyToAll={handleApplyToAll}
      />

      {errors.workingHours && (
        <Center className={classes.error}>{errors.workingHours}</Center>
      )}
      <Center mt="lg">
        <Button onClick={handleGoBack} mr="lg">
          <IconArrowLeft /> {t('establishments.goBack')}
        </Button>
        <Button type="submit">{t('establishments.create')}</Button>
      </Center>
    </form>
  );
};
