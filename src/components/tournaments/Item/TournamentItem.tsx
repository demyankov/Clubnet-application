import { FC, MouseEvent } from 'react';

import { Box, Button, Card, createStyles, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconUsersGroup } from '@tabler/icons-react';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { dateFormatting } from 'helpers/dateFormatting';
import { useUserRole } from 'hooks';
import { ITournamentData } from 'store/slices';
import { useTournaments } from 'store/store';

const useStyles = createStyles({
  card: {
    cursor: 'pointer',
    transition: 'all .2s',

    '&:hover': {
      transform: 'scale(1.01)',
    },
  },
});

export const TournamentItem: FC<{ data: ITournamentData }> = ({ data }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { deleteTournament, getTournaments } = useTournaments((store) => store);

  const handleCardClick = (id: string): void => {
    navigate(`${Paths.tournaments}/${id}`);
  };

  const handleDeleteClick = async (): Promise<void> => {
    await deleteTournament(data.id);
    await getTournaments();
  };

  const handleButtonClick = (e: MouseEvent): void => {
    e.stopPropagation();
    modals.openConfirmModal({
      title: t('modals.deleteTournament'),
      centered: true,
      children: <Text size="sm">{t('modals.agreeToDelete')}</Text>,
      labels: { confirm: t('modals.btnDelete'), cancel: t('modals.btnCancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => handleDeleteClick(),
    });
  };

  return (
    <Card
      withBorder
      p="10px"
      className={classes.card}
      mb="20px"
      onClick={() => handleCardClick(data.id)}
    >
      <Group position="apart" noWrap>
        <div>
          <Text c="dimmed" fz="xs">
            {dateFormatting(data.expectedDate)}
          </Text>
          <Text fw={700} lineClamp={2}>
            {data.name}
          </Text>
          <Text c="dimmed" fz="xs">
            {data.game} · {data.format}
          </Text>
        </div>
        <Group noWrap>
          {isAdmin && (
            <Button
              variant="light"
              color="red"
              size="xs"
              uppercase
              onClick={handleButtonClick}
            >
              {t('modals.btnDelete')}
            </Button>
          )}
          <Box display="flex">
            <IconUsersGroup color="#1971C2" />
            <div>0/{data.countOfMembers}</div>
          </Box>
        </Group>
      </Group>
    </Card>
  );
};
