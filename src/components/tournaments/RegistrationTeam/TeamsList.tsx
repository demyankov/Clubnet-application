import { FC, MouseEvent, useCallback, useMemo } from 'react';

import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { t } from 'i18next';

import { TeamLink, RenderContentContainer } from 'components';
import { useTournaments } from 'store/store';

export const TeamsListInTournament: FC = () => {
  const { isFetching, currentTournament, deleteTeamFromTournament } = useTournaments(
    (store) => store,
  );

  const teams = useMemo(() => currentTournament?.teams || [], [currentTournament]);

  const isLoading = isFetching && !teams.length;

  const handleDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>, id: string): void => {
      e.stopPropagation();
      modals.openConfirmModal({
        title: t('modals.deleteTeamFromTournament'),
        centered: true,
        children: <Text size="sm">{t('modals.agreeToDeleteTeam')}</Text>,
        labels: { confirm: t('modals.btnDelete'), cancel: t('modals.btnCancel') },
        confirmProps: { color: 'red' },
        onConfirm: () => deleteTeamFromTournament(id, currentTournament),
      });
    },
    [deleteTeamFromTournament, currentTournament],
  );

  const teamsList = useMemo(
    () =>
      teams.map((team) => (
        <TeamLink key={team.id} teamData={team} handleDelete={handleDelete} />
      )),
    [teams, handleDelete],
  );

  return (
    <RenderContentContainer isFetching={isLoading}>{teamsList}</RenderContentContainer>
  );
};
