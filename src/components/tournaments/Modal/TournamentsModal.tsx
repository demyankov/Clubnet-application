import { FC } from 'react';

import { Button, FileInput, Group, Select, Stack, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { SelectItem, TOURNAMENTS_CONFIG } from 'components';
import { ALLOWED_IMAGE_FORMATS } from 'constants/allowedImageFormats';
import { DatabaseId } from 'constants/databaseId';
import { DateFormats } from 'constants/dateFormats';
import { GAMES } from 'constants/games';
import { uniqueIdGenerator } from 'helpers';
import { requiredFieldsGenerator } from 'helpers/requiredFieldsGenerator';
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
  const { addTournament, isFetching } = useTournaments((state) => state);

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

    validate: (values) => {
      const requiredFields = requiredFieldsGenerator<IFormValues>(values);

      const countOfMembersError: { countOfMembers?: string | null } = {};
      const { gameMode, countOfMembers } = values;

      if (+countOfMembers > 999) {
        countOfMembersError.countOfMembers = `${t('tournaments.maxCount')} 999`;
      } else {
        const isMultiple = +countOfMembers % (+gameMode.split('v')[0] * 2) === 0;

        if (!isMultiple || !countOfMembers) {
          countOfMembersError.countOfMembers = t('modals.shouldBeMultiple');
        }
      }

      return {
        ...requiredFields,
        ...countOfMembersError,
      };
    },
  });

  const handleSubmit = (): void => {
    const expectedDate = form.values.expectedDate
      ? new Date(form.values.expectedDate).toString()
      : '';
    const registrationDate = new Date().toString();

    addTournament(
      {
        ...form.values,
        id: uniqueIdGenerator(DatabaseId.Tournament),
        expectedDate,
        registrationDate,
      },
      form.reset,
    );
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
          label={t('modals.games')}
          itemComponent={SelectItem}
          data={GAMES}
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
          type="number"
          withAsterisk
          placeholder={`${t('tournaments.maxCount')} 999`}
          label={t('modals.countOfMembers')}
          {...form.getInputProps('countOfMembers')}
        />

        <DateTimePicker
          locale={i18n.language}
          minDate={new Date()}
          withAsterisk
          valueFormat={DateFormats.DayMonthYearTime}
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
