import { FC, ReactElement, useEffect } from 'react';

import { Button, Center, Divider, Group, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

import { RenderContentContainer, TournamentItem, TournamentsModal } from 'components';
import { groupByDate } from 'helpers/groupByDate';
import { useRole } from 'hooks';
import { ITournamentData } from 'store/slices';
import { useTournaments } from 'store/store';

export const TournamentsList: FC = () => {
  const { t } = useTranslation();
  const { isAdmin } = useRole();
  const {
    isFetching,
    getTournaments,
    tournaments,
    isGetMoreFetching,
    totalCount,
    getMoreTournaments,
  } = useTournaments((state) => state);

  const IsShowMoreButtonShown = totalCount > tournaments.length;

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
      <Title mb="md" order={2}>
        {t('tournaments.tournaments')}
      </Title>

      <Group mt="md" position="apart">
        <Text c="dimmed">{`${t('tournaments.totalCount')}: ${totalCount}`}</Text>

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
          {IsShowMoreButtonShown && (
            <Button m="20px" onClick={getMoreTournaments} loading={isGetMoreFetching}>
              {t('tournaments.showMore')}
            </Button>
          )}
        </Center>
      </RenderContentContainer>
    </>
  );
};
