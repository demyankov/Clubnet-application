import { FC } from 'react';

import { SelectTeamForRegistration, TeamCompositionForRegistration } from 'components';

interface IRegistrationTeamStep {
  id: string;
  children: FC;
  label: string;
  description: string;
}

export const registrationTeamSteps: IRegistrationTeamStep[] = [
  {
    id: '1',
    children: SelectTeamForRegistration,
    label: 'tournaments.selectTeam',
    description: 'tournaments.selectTeamForRegistration',
  },
  {
    id: '2',
    children: TeamCompositionForRegistration,
    label: 'tournaments.teamComposition',
    description: 'tournaments.selectTeamComposition',
  },
];
