import { FC } from 'react';

import { Box, createStyles, Text } from '@mantine/core';
import { IconCrown, IconCurrentLocation, IconUser } from '@tabler/icons-react';

import { Roles } from 'constants/userRoles';
import { isValueIncludedInObjectsArray } from 'helpers';
import { useTeams, useTournaments } from 'store/store';

const useStyles = createStyles((theme) => ({
  teamWrapper: {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center',
    padding: theme.spacing.sm,
    cursor: 'pointer',
    borderRadius: '4px',
  },
  name: {
    flex: '1',
  },
}));

export const GamersListForRegistration: FC = () => {
  const { teamCompositionForRegistration, toggleGamerForRegistration } = useTournaments(
    (store) => store,
  );
  const { membersInTeam } = useTeams((store) => store);
  const { classes } = useStyles();

  const handleGamer = (gamerId: string, role: Roles): void => {
    if (role !== Roles.CAPTAIN) {
      toggleGamerForRegistration(gamerId, role);
    }
  };

  return (
    <>
      {membersInTeam.map((gamer) => {
        const { id, name, nickName, role } = gamer;
        const isActive = isValueIncludedInObjectsArray(
          teamCompositionForRegistration,
          'id',
          id,
        );
        const isCaptain = role === Roles.CAPTAIN;

        return (
          <Box
            key={id}
            className={classes.teamWrapper}
            onClick={() => {
              handleGamer(id, role);
            }}
          >
            <IconUser color="#1971C2" />
            <Box className={classes.name}>
              <Text size="sm" weight={500}>
                {nickName}
              </Text>
              <Text color="dimmed" size="xs">
                {name}
              </Text>
            </Box>
            {isCaptain && <IconCrown color="#ebee22" />}
            {isActive && <IconCurrentLocation color="#1971C2" />}
          </Box>
        );
      })}
    </>
  );
};
