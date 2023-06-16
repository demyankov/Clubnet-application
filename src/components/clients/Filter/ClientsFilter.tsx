import React, { FC } from 'react';

import { Box, Button, Group, Input, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { IoIosSearch } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { IMaskInput } from 'react-imask';

import { useClients } from 'store/store';

export const ClientsFilter: FC = () => {
  const { getClients, isClientsFetching } = useClients((state) => state);
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      phone: '',
      nickname: '',
    },
  });

  const handleSubmit = (values: typeof form.values): void => {
    getClients(values);
  };

  const handleReset = (): void => {
    form.reset();
    getClients([]);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box
        mt="xl"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          padding: theme.spacing.xl,
          borderRadius: theme.radius.md,
        })}
      >
        <Group>
          <Input.Wrapper id="phone-input" label={t('common.phone')} inputMode="tel">
            <Input
              component={IMaskInput}
              mask="+375 (00) 000-00-00"
              id="phone-input"
              placeholder="+375 (00) 000-00-00"
              {...form.getInputProps('phone')}
            />
            <Input.Error>{form.errors.phone}</Input.Error>
          </Input.Wrapper>

          <TextInput
            label={t('common.nickname') as string}
            {...form.getInputProps('nickname')}
          />
        </Group>
      </Box>

      <Group mt="xl" position="center">
        <Button disabled={isClientsFetching} leftIcon={<IoIosSearch />} type="submit">
          {t('common.search')}
        </Button>

        <Button
          disabled={isClientsFetching}
          onClick={handleReset}
          leftIcon={<IoClose />}
          variant="outline"
        >
          {t('common.reset')}
        </Button>
      </Group>
    </form>
  );
};
