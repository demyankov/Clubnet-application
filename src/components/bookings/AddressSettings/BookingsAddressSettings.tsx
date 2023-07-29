import { FC } from 'react';

import {
  Flex,
  TextInput,
  UnstyledButton,
  Text,
  createStyles,
  Input,
  Center,
  Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';

import { BookingsWorkingDaysInputs } from 'components';
import { weekdays } from 'constants/weekdays';
import { validatePhone } from 'helpers';
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

type Props = {
  close: () => void;
};

export const BookingsAddressSettings: FC<Props> = ({ close }) => {
  const { currentAddress, updateAddress } = useBookings((state) => state.addressActions);
  const { classes } = useStyles();
  const { t } = useTranslation();

  const workingHours = {} as IWorkingHours;

  weekdays.forEach((day) => {
    if (currentAddress) {
      const { isAvailable, start, finish } = currentAddress.workingHours[day];

      workingHours[day] = { isAvailable, start, finish };
    }
  });

  const { values, errors, onSubmit, getInputProps, setFieldValue } = useForm({
    initialValues: {
      city: currentAddress?.city!,
      address: currentAddress?.address!,
      phone: currentAddress?.phone!,
      workingHours,
    },

    validate: (values) => {
      const city = values.city ? null : t('modals.requiredField');
      const address = values.address ? null : t('modals.requiredField');
      const phone = validatePhone(values.phone);
      let workingHours = null;
      let isValid = false;

      weekdays.forEach((day) => {
        if (values.workingHours[day].isAvailable) {
          isValid = true;
        }
      });

      if (!isValid) {
        workingHours = t('address.setWorkingHours');
      }

      return { city, address, phone, workingHours };
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
    close();

    updateAddress(values);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <TextInput
        withAsterisk
        label={t('establishments.city')}
        placeholder={t('establishments.cityPlaceholder') as string}
        mb="sm"
        {...getInputProps('city')}
      />

      <TextInput
        withAsterisk
        label={t('establishments.address')}
        placeholder={t('establishments.addressPlaceholder') as string}
        mb="sm"
        {...getInputProps('address')}
      />

      <Input.Wrapper
        id="phone-input"
        label={t('establishments.phone')}
        withAsterisk
        mb="sm"
        inputMode="tel"
      >
        <Input
          component={IMaskInput}
          mask="+375 (00) 000-00-00"
          id="phone-input"
          placeholder="+375 (25) 123-45-67"
          {...getInputProps('phone')}
        />
        <Input.Error>{errors.phone}</Input.Error>
      </Input.Wrapper>

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
      <Text ta="end">
        <Button type="submit">{t('address.save')}</Button>
      </Text>
    </form>
  );
};
