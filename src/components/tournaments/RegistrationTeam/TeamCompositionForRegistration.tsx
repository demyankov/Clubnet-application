import { FC, useEffect } from 'react';

import { GamersListForRegistration } from 'components/tournaments/RegistrationTeam/GamersListForRegistration';
import { RegistrationTeamLayout } from 'components/tournaments/RegistrationTeam/RegistrationTeamLayout';
import { Roles } from 'constants/userRoles';
import { useAuth, useTeams, useTournaments } from 'store/store';

export const TeamCompositionForRegistration: FC = () => {
  const { user } = useAuth((store) => store);
  const { getTeamById } = useTeams((store) => store);
  const { selectedTeamId, addGamerForRegistration } = useTournaments((store) => store);

  useEffect(() => {
    if (user) {
      addGamerForRegistration(user.id, Roles.CAPTAIN);
      getTeamById(selectedTeamId);
    }
  }, [user, selectedTeamId, addGamerForRegistration, getTeamById]);

  return (
    <RegistrationTeamLayout>
      <GamersListForRegistration />
    </RegistrationTeamLayout>
  );
};
