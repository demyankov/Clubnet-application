import React, { FC } from 'react';

import {
  Box,
  Button,
  createStyles,
  Grid,
  Group,
  Input,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';
import { Link, useNavigate } from 'react-router-dom';

import { SelectItem } from 'components';
import { ROLES_DATA } from 'components/clients/config';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import { isDarkTheme } from 'helpers';
import { useClients } from 'store/store';

const useStyles = createStyles((theme) => ({
  editContainer: {
    alignItems: 'flex-end',
  },
  goBack: {
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
  },
  btnText: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}));

export const ClientsEdit: FC = () => {
  const { classes } = useStyles();
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

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid align="center">
        <Grid.Col span={4}>
          <Button component={Link} to={Paths.clients} className={classes.goBack}>
            <IconArrowLeft size={20} />
            <Text className={classes.btnText}>{t('clients.back')}</Text>
          </Button>
        </Grid.Col>
      </Grid>
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
        <Group className={classes.editContainer}>
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
        </Group>
      </Box>
    </form>
  );
};
