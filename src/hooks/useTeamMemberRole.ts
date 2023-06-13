import { Roles } from 'constants/userRoles';

interface ITeamMemberRole {
  isCaptain: boolean;
}

export const useTeamMemberRole = (role: Roles): ITeamMemberRole => {
  const isCaptain = role === Roles.CAPTAIN;

  return { isCaptain };
};
