import { FC } from 'react';

import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { SelectItem } from 'components/shared';
import { DatabaseId } from 'constants/databaseId';
import { GAMES } from 'constants/games';
import { uniqueIdGenerator } from 'helpers';
import { requiredFieldsGenerator } from 'helpers/requiredFieldsGenerator';
import { useAuth } from 'store/store';

interface IFormValues {
  name: string;
  tag: string;
  game: string;
}

export const ProfileCreateTeamModal: FC = () => {
  const { t } = useTranslation();
  const { isTeamFetching, addTeam } = useAuth((store) => store);

  const form = useForm<IFormValues>({
    initialValues: {
      name: '',
      tag: '',
      game: '',
    },
    validate: (values) => requiredFieldsGenerator<IFormValues>(values),
  });

  const handleSubmit = (): void => {
    addTeam(
      {
        ...form.values,
        id: uniqueIdGenerator(DatabaseId.Team),
      },
      form.reset,
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="xl">
        <TextInput
          withAsterisk
          maxLength={15}
          placeholder={t('teams.maxLength') + 15}
          label={t('teams.modalNameLabel')}
          {...form.getInputProps('name')}
        />

        <TextInput
          withAsterisk
          maxLength={8}
          placeholder={t('teams.maxLength') + 8}
          label={t('teams.modalTagLabel')}
          {...form.getInputProps('tag')}
        />

        <Select
          withAsterisk
          label={t('modals.game')}
          itemComponent={SelectItem}
          data={GAMES}
          {...form.getInputProps('game')}
        />

        <Group position="right" mt="md">
          <Button type="submit" loading={isTeamFetching}>
            {t('teams.createButtonText')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
