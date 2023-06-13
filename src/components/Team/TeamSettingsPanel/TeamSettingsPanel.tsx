import { FC, FormEvent } from 'react';

import { Button, FileInput, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { SelectItem } from 'components/shared';
import { ALLOWED_IMAGE_FORMATS } from 'constants/allowedImageFormats';
import { GAMES } from 'constants/games';
import { useAuth } from 'store/store';

export interface ITeamFormValues {
  name: string | undefined;
  game: string | undefined;
  about: string;
  image: File | string;
}

export const TeamSettingsPanel: FC = () => {
  const { t } = useTranslation();

  const { currentTeam, updateTeam, isUpdateTeamFetching } = useAuth((store) => store);

  const form = useForm<ITeamFormValues>({
    initialValues: {
      name: currentTeam?.name,
      game: currentTeam?.game,
      about: currentTeam?.about || '',
      image: '',
    },
  });

  const handleSubmitModal = (a: FormEvent<HTMLFormElement>): void => {
    a.preventDefault();
    updateTeam(form.values);
  };

  return (
    <form onSubmit={(a) => handleSubmitModal(a)}>
      <Stack spacing="xl">
        <TextInput
          maxLength={15}
          placeholder={t('teams.maxLength') + 15}
          label={t('teams.modalNameLabel')}
          {...form.getInputProps('name')}
        />

        <Select
          label={t('modals.game')}
          itemComponent={SelectItem}
          data={GAMES}
          {...form.getInputProps('game')}
        />

        <Textarea label={t('teams.aboutTeam')} {...form.getInputProps('about')} />

        <FileInput
          accept={ALLOWED_IMAGE_FORMATS.join(',')}
          label={t('teams.teamImage')}
          icon={<IconUpload size={15} />}
          {...form.getInputProps('image')}
        />

        <Button type="submit" mt={10} loading={isUpdateTeamFetching}>
          {t('profile.save')}
        </Button>
      </Stack>
    </form>
  );
};
