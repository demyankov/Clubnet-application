import { FC } from 'react';

import { Button, Group } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

import { TournamentsModal, TournamentsList } from 'components/tournaments';
import { useUserRole } from 'hooks';

const Tournaments: FC = () => {
  const { isAdmin } = useUserRole();
  const { t } = useTranslation();

  const handleCreate = (): void => {
    modals.open({
      title: t('tournaments.modalTitle'),
      children: <TournamentsModal />,
      centered: true,
    });
  };

  return (
    <Group>
      {isAdmin && (
        <Button onClick={handleCreate}>{t('tournaments.createButtonText')}</Button>
      )}

      <TournamentsList />
    </Group>
  );
};

export default Tournaments;
