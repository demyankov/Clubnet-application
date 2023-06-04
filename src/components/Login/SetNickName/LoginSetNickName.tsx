import { FC, useState, useEffect, useCallback } from 'react';

import { TextInput, Group, Button, LoadingOverlay, Text, Flex } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { BsCheck } from 'react-icons/bs';
import { RiCloseCircleFill } from 'react-icons/ri';

import { LoginViewsProps } from 'components/Login/types';
import { useAuth } from 'store/store';

export const LoginSetNickName: FC<LoginViewsProps> = () => {
  const { t } = useTranslation();

  const { isFetching, setNickName, nickNameExists } = useAuth((state) => state.signIn);

  const [confirmed, setConfirmed] = useState<boolean>(false);

  const {
    values: { nickName },
    getInputProps,
    onSubmit,
  } = useForm({
    initialValues: {
      nickName: '',
    },
  });

  const [debounced] = useDebouncedValue(nickName, 500);

  const check = useCallback(async (): Promise<void> => {
    const exists = await nickNameExists(debounced);

    if (exists) {
      setConfirmed(false);

      return;
    }

    setConfirmed(true);
  }, [debounced, nickNameExists]);

  useEffect(() => {
    if (debounced.length >= 2) {
      check();
    }

    setConfirmed(false);
  }, [check, debounced]);

  const onSubmitNickName = (): void => {
    setNickName(nickName);
  };

  return (
    <form onSubmit={onSubmit(onSubmitNickName)}>
      <LoadingOverlay visible={isFetching} />

      <TextInput
        my="xs"
        label={t('form.setNickname')}
        required
        autoFocus
        description={t('form.nicknameNote')}
        placeholder={t('form.yourNickname') as string}
        {...getInputProps('nickName')}
      />

      {!confirmed && nickName.length >= 2 && (
        <Flex c="red" gap="0.1rem" align="center">
          <RiCloseCircleFill size="1rem" />
          <Text size="xs">{t('form.nicknameBad')}</Text>
        </Flex>
      )}

      {confirmed && (
        <Flex c="teal" gap="0.1rem" align="center">
          <BsCheck size="1rem" />
          <Text size="xs">{t('form.nicknameOK')}</Text>
        </Flex>
      )}

      <Group position="center" mt="xl">
        <Button
          loading={isFetching}
          type="submit"
          radius="xl"
          disabled={isFetching || !confirmed}
        >
          {t('form.toSetNickname')}
        </Button>
      </Group>
    </form>
  );
};
