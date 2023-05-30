import { FC, ReactElement, useEffect } from 'react';

import { Button, Center, Divider, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

import { RenderContentContainer } from 'components/shared';
import { TournamentItem, TournamentsModal } from 'components/tournaments';
import { groupByDate } from 'helpers/groupByDate';
import { useUserRole } from 'hooks';
import { ITournamentData } from 'store/slices';
import { useTournaments } from 'store/store';

export const TournamentsList: FC = () => {
  const { t } = useTranslation();
  const { isAdmin } = useUserRole();
  const {
    isFetching,
    getTournaments,
    tournaments,
    isEmpty,
    getMoreTournaments,
    isGetMoreFetching,
  } = useTournaments((state) => state);

  useEffect(() => {
    getTournaments();
  }, [getTournaments]);

  const getSortedTournaments = (): ReactElement[] => {
    const items = groupByDate(tournaments);

    return items.map((item) => {
      return (
        <div key={item.id}>
          <Divider mb="10px" label={item.title} />
          {item.items.map((item: ITournamentData) => (
            <TournamentItem key={item.id} data={item} />
          ))}
        </div>
      );
    });
  };

  const handleCreate = (): void => {
    modals.open({
      modalId: 'addTournamentModal',
      title: t('tournaments.modalTitle'),
      children: <TournamentsModal />,
      centered: true,
    });
  };

  return (
    <>
      <Group position="apart" mb="30px">
        <Text fz="xl" fw={700}>
          {t('tournaments.tournaments')}
        </Text>
        {isAdmin && (
          <Button onClick={handleCreate}>{t('tournaments.createButtonText')}</Button>
        )}
      </Group>
      <RenderContentContainer
        isFetching={isFetching}
        emptyTitle={t('tournaments.noTournaments')}
        isEmpty={!tournaments.length}
      >
        {getSortedTournaments()}
        <Center m="20px">
          {!isEmpty && (
            <Button m="20px" onClick={getMoreTournaments} loading={isGetMoreFetching}>
              {t('tournaments.showMore')}
            </Button>
          )}
        </Center>
      </RenderContentContainer>
    </>
  );
};
