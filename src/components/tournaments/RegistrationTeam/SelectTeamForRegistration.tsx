import { useEffect } from 'react';

import { Box, createStyles, Text } from '@mantine/core';
import { IconUsersGroup, IconCurrentLocation } from '@tabler/icons-react';
import { t } from 'i18next';

import { RenderContentContainer } from 'components/shared';
import { RegistrationTeamLayout } from 'components/tournaments/RegistrationTeam/RegistrationTeamLayout';
import { Roles } from 'constants/userRoles';
import { isDarkTheme } from 'helpers';
import { useAuth, useTeams, useTournaments } from 'store/store';

const useStyles = createStyles((theme) => ({
  teamWrapper: {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center',
    padding: theme.spacing.sm,
    cursor: 'pointer',
    borderRadius: '4px',
  },
  active: {
    backgroundColor: isDarkTheme(theme.colorScheme)
      ? theme.colors.dark[3]
      : theme.colors.gray[3],
  },
  name: {
    flex: '1',
  },
}));

export const SelectTeamForRegistration = (): JSX.Element => {
  const { user } = useAuth((store) => store);
  const { teams, getTeamsByRole, isTeamFetching } = useTeams((store) => store);
  const { selectedTeamId, setSelectedTeamId, clearTeamComposition, currentTournament } =
    useTournaments((store) => store);
  const { classes, cx } = useStyles();

  const userId = user?.id;
  const currentGameTeams = teams.filter(({ game }) => game === currentTournament?.game);
  const countOfTeams = currentGameTeams.length;
  const isFetching = isTeamFetching && !countOfTeams;

  useEffect(() => {
    if (userId) {
      getTeamsByRole(userId, Roles.CAPTAIN);
    }
    clearTeamComposition();
  }, [userId, getTeamsByRole, clearTeamComposition]);

  return (
    <RegistrationTeamLayout>
      <RenderContentContainer isFetching={isFetching}>
        {currentGameTeams.map((team) => {
          const { name, tag, game, id } = team;
          const isActive = selectedTeamId === id;

          return (
            <Box
              key={id}
              className={cx(classes.teamWrapper, {
                [classes.active]: isActive,
              })}
              onClick={() => setSelectedTeamId(id)}
            >
              <IconUsersGroup color="#1971C2" />
              <Box className={classes.name}>
                <Text size="sm" weight={500}>
                  {`${name} (${tag})`}
                </Text>
                <Text color="dimmed" size="xs">
                  {game}
                </Text>
              </Box>
              {isActive && <IconCurrentLocation color="#1971C2" />}
            </Box>
          );
        })}
        {!countOfTeams && <Text>{t('tournaments.noTeams')}</Text>}
      </RenderContentContainer>
    </RegistrationTeamLayout>
  );
};
