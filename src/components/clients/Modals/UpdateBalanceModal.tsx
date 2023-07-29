import { FC } from 'react';

import { Button, Group, NumberInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { FaCoins } from 'react-icons/fa';

import { IUpdateBalanceFormValues } from 'components/clients/types';
import { useAuth, useBalanceHistory } from 'store/store';

type Props = {
  userId: string;
  balance?: number;
};

export const UpdateBalanceModal: FC<Props> = ({ userId, balance = 0 }) => {
  const { t } = useTranslation();

  const { updateBalance, isBalanceFetching } = useBalanceHistory();

  const { user } = useAuth((state) => state);

  const { getInputProps, values, reset, onSubmit } = useForm<IUpdateBalanceFormValues>({
    initialValues: {
      addBalance: '',
      subtractBalance: '',
    },
  });

  const handleSubmit = ({ subtractBalance, addBalance }: typeof values): void => {
    const balance = +addBalance || -subtractBalance;

    const data = {
      balance,
      userId,
      adminId: user?.id as string,
    };

    updateBalance(data, reset);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack spacing="xl">
        <Text>1 рубль = 1 coin</Text>
        <Text>
          {t('modals.currentBalance')}: {balance}
        </Text>

        <NumberInput
          label={t('modals.add')}
          disabled={!!values.subtractBalance}
          icon={<FaCoins size="20" />}
          error
          min={0}
          type="number"
          {...getInputProps('addBalance')}
        />

        <NumberInput
          label={t('modals.reduce')}
          disabled={!!values.addBalance || !balance}
          icon={<FaCoins size="20" />}
          max={balance}
          min={0}
          type="number"
          {...getInputProps('subtractBalance')}
        />

        <Group position="right" mt="md">
          <Button
            disabled={!values.addBalance && !values.subtractBalance}
            type="submit"
            loading={isBalanceFetching}
          >
            {!values.subtractBalance ? t('modals.add') : t('modals.reduce')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
