import { FC } from 'react';

import { Button, FileInput, Group, Select, Stack, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useId } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconUpload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { SelectItem } from 'components/shared';
import { TOURNAMENTS_CONFIG } from 'components/tournaments/Modal/config';
import { ALLOWED_IMAGE_FORMATS } from 'constants/allowedImageFormats';
import { useTournaments } from 'store/store';

interface IFormValues {
  name: string;
  game: string;
  format: string;
  expectedDate: string;
  gameMode: string;
  countOfMembers: string;
  image: File | null;
}

export const TournamentsModal: FC = () => {
  const { t, i18n } = useTranslation();
  const { addTournament, getTournaments, isFetching } = useTournaments((state) => state);
  const id = `tournament-${useId().split('-')[1]}`;

  const form = useForm<IFormValues>({
    initialValues: {
      name: '',
      game: '',
      format: '',
      expectedDate: '',
      gameMode: '',
      countOfMembers: '',
      image: null,
    },
    validate: {
      name: (value) => (value ? null : t('modals.requiredField')),
      game: (value) => (value ? null : t('modals.requiredField')),
      format: (value) => (value ? null : t('modals.requiredField')),
      expectedDate: (value) => (value ? null : t('modals.requiredField')),
      gameMode: (value) => (value ? null : t('modals.requiredField')),
      countOfMembers: (value, values) => {
        const { gameMode } = values;
        const isMultiple = +value % (+gameMode.split('v')[0] * 2) === 0;

        if (+value > 999) {
          return `${t('tournaments.maxCount')} 999`;
        }

        return isMultiple && value ? null : t('modals.shouldBeMultiple');
      },
      image: (value) => (value ? null : t('modals.requiredField')),
    },
  });

  const handleSubmit = async (): Promise<void> => {
    const expectedDate = form.values.expectedDate
      ? new Date(form.values.expectedDate).toString()
      : '';
    const registrationDate = new Date().toString();

    await addTournament({
      ...form.values,
      id,
      expectedDate,
      registrationDate,
    });

    await getTournaments();

    form.reset();
    modals.close('addTournamentModal');
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="xl">
        <TextInput
          withAsterisk
          label={t('modals.tournamentName')}
          {...form.getInputProps('name')}
        />

        <Select
          withAsterisk
          label={t('modals.game')}
          itemComponent={SelectItem}
          data={TOURNAMENTS_CONFIG.Games}
          {...form.getInputProps('game')}
        />

        <Select
          withAsterisk
          label={t('modals.tournamentFormat')}
          data={TOURNAMENTS_CONFIG.Formats}
          {...form.getInputProps('format')}
        />

        <Select
          withAsterisk
          label={t('modals.gameMode')}
          data={TOURNAMENTS_CONFIG.Gamemodes}
          {...form.getInputProps('gameMode')}
        />

        <TextInput
          withAsterisk
          type="number"
          placeholder={`${t('tournaments.maxCount')} 999`}
          label={t('modals.countOfMembers')}
          {...form.getInputProps('countOfMembers')}
        />

        <DateTimePicker
          locale={i18n.language}
          minDate={new Date()}
          withAsterisk
          valueFormat="DD.MM.YYYY, HH:mm"
          label={t('modals.startTime')}
          {...form.getInputProps('expectedDate')}
        />

        <FileInput
          withAsterisk
          accept={ALLOWED_IMAGE_FORMATS.join(',')}
          label={t('modals.addImage')}
          icon={<IconUpload size={15} />}
          {...form.getInputProps('image')}
        />

        <Group position="right" mt="md">
          <Button type="submit" loading={isFetching}>
            {t('modals.createTournament')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
