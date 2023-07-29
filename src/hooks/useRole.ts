import { Roles } from 'constants/userRoles';
import { useAuth } from 'store/store';

interface IUserRoles {
  isAdmin: boolean;
  isUser: boolean;
  isCaptain: boolean;
  isManager: boolean;
}

export const useRole = (role?: Roles): IUserRoles => {
  const { user } = useAuth((state) => state);

  const isAdmin = user?.role === Roles.ADMIN;
  const isUser = user?.role === Roles.USER;
  const isCaptain = role === Roles.CAPTAIN;
  const isManager = user?.role === Roles.MANAGER;

  return { isAdmin, isUser, isCaptain, isManager };
};
