import { FC } from 'react';

import { Button, Center, Input, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';

import { AddAddressSteps, AddressStepsProps } from 'components';
import { validatePhone, formatPhoneNumber } from 'helpers';
import { useBookings } from 'store/store';

export const BookingsAddAddressStep: FC<AddressStepsProps> = ({
  formValues,
  setFormValues,
  setCurrentStep,
}) => {
  const { currentEstablishment } = useBookings((state) => state.establishmentActions);
  const { t } = useTranslation();

  const { values, errors, getInputProps, onSubmit } = useForm({
    initialValues: formValues,
    validate: {
      name: (value) => {
        if (!currentEstablishment) {
          return value ? null : t('modals.requiredField');
        }
      },
      city: (value) => (value ? null : t('modals.requiredField')),
      address: (value) => (value ? null : t('modals.requiredField')),
      phone: (value) => validatePhone(value),
    },
  });

  const handleSubmit = (): void => {
    const phone = formatPhoneNumber(values.phone);

    setFormValues({ ...values, phone });
    setCurrentStep(AddAddressSteps.WorkingHours);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      {!currentEstablishment && (
        <TextInput
          withAsterisk
          label={t('establishments.name')}
          placeholder={t('establishments.estName') as string}
          mb="sm"
          {...getInputProps('name')}
        />
      )}

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

      <Center pt="xs">
        <Button type="submit">
          {t('establishments.workingHours')} <IconArrowRight />
        </Button>
      </Center>
    </form>
  );
};
