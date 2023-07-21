import React, { FC } from 'react';

import { Box, Button, Group, Input, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';

import { ROLES_DATA } from 'components/clients/config';
import { SelectItem } from 'components/shared';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import { isDarkTheme } from 'helpers';
import { useClients } from 'store/store';

export const ClientsEdit: FC = () => {
  const { client, updateClientData, isClientsFetching } = useClients((state) => state);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: client?.name || '',
      role: client?.role || Roles.USER,
      nickName: client?.nickName,
    },
  });

  const handleSubmit = (values: typeof form.values): void => {
    if (values.nickName === client?.nickName) {
      const data = { ...values };

      delete data.nickName;

      updateClientData(data, form.setFieldError, navigate);

      return;
    }
    updateClientData(values, form.setFieldError, navigate);
  };

  const handleCancelButton = (): void => navigate(`${Paths.clients}`);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box
        mt="xl"
        sx={(theme) => ({
          backgroundColor: isDarkTheme(theme.colorScheme)
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
          padding: theme.spacing.xl,
          borderRadius: theme.radius.md,
        })}
      >
        <Group>
          <TextInput label={t('common.fullName')} {...form.getInputProps('name')} />

          <Select
            label={t('common.role')}
            itemComponent={SelectItem}
            data={ROLES_DATA}
            {...form.getInputProps('role')}
          />

          <TextInput label={t('common.nickname')} {...form.getInputProps('nickName')} />

          <Input.Wrapper id="phone-input" label={t('common.phone')} inputMode="tel">
            <Input
              disabled
              component={IMaskInput}
              mask="+375 (00) 000-00-00"
              id="phone-input"
              placeholder="+375 (00) 000-00-00"
            />
            <Input.Error>{form.errors.phone}</Input.Error>
          </Input.Wrapper>

          <Button type="submit" loading={isClientsFetching}>
            {t('clients.btnSave')}
          </Button>
          <Button loading={isClientsFetching} onClick={handleCancelButton}>
            {t('clients.btnCancel')}
          </Button>
        </Group>
      </Box>
    </form>
  );
};