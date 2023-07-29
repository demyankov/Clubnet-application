import { FC } from 'react';

import { Button, Group, Input, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';

import { IClientsModalFormValues } from 'components/clients/types';
import { formatPhoneNumber } from 'helpers/formatters';
import { useClients } from 'store/store';

export const ClientsModal: FC = () => {
  const { t } = useTranslation();
  const { addUser, isClientsFetching } = useClients((state) => state);

  const form = useForm<IClientsModalFormValues>({
    initialValues: {
      name: '',
      phone: '',
    },
    validate: {
      name: (value) => {
        if (!value) {
          return t('modals.requiredField');
        }
      },
      phone: (value) => {
        if (!value) {
          return t('modals.requiredField');
        }

        const processedPhone = formatPhoneNumber(value);
        const prefixRegex = /^\+375\s?(25|29|33|44)/;

        if (!prefixRegex.test(processedPhone) || formatPhoneNumber(value).length < 12) {
          return t('form.phoneFormat');
        }

        return null;
      },
    },
  });

  const handleSubmit = (): void => {
    const phone = formatPhoneNumber(form.values.phone);

    addUser({ ...form.values, phone }, form.reset);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="xl">
        <TextInput withAsterisk label="Name" {...form.getInputProps('name')} />

        <Input.Wrapper
          id="phone-input"
          label="Phone"
          withAsterisk
          mb="sm"
          inputMode="tel"
        >
          <Input
            component={IMaskInput}
            mask="+375 (00) 000-00-00"
            id="phone-input"
            placeholder="+375 (25) 123-45-67"
            {...form.getInputProps('phone')}
          />
          <Input.Error>{form.errors.phone}</Input.Error>
        </Input.Wrapper>

        <Group position="right" mt="md">
          <Button type="submit" loading={isClientsFetching}>
            {t('modals.createTournament')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
