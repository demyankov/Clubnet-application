import { FC } from 'react';

import { Button, Text, Group, Paper, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { SelectItem } from 'components/shared';

export const TournamentsModal: FC = () => {
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      tournamentName: '',
      game: '',
      format: '',
      gameMode: '',
    },
    // Это обязательное поле, оно не может быть пустым.
  });

  const handleSubmit = (): void => {};

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="xl">
        <TextInput label="Название турнира" {...form.getInputProps('tournamentName')} />

        <Select
          label="Игра"
          itemComponent={SelectItem}
          data={[
            {
              image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
              label: 'CS:GO',
              value: 'csgo',
            },

            {
              image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
              label: 'Dota 2',
              value: 'dota2',
            },
          ]}
          {...form.getInputProps('game')}
        />

        <Stack>
          <Select
            label="Формат турнира"
            placeholder="Pick one"
            data={[{ value: 'olympic system', label: 'Олимпийская система' }]}
          />

          <Paper p="xs" withBorder>
            <Text>Каждый игрок играет в матчах до тех пор, пока не проиграет.</Text>
          </Paper>
        </Stack>

        <Select
          label="Режим игры"
          placeholder="Pick one"
          data={[
            { value: '1v1', label: '1v1' },
            { value: '2v2', label: '2v2' },
            { value: '5v5', label: '5v5' },
            { value: 'wingman', label: 'Wingman' },
          ]}
        />

        <Group position="right" mt="md">
          <Button type="submit">{t('tournaments.createTournament')}</Button>
        </Group>
      </Stack>
    </form>
  );
};
