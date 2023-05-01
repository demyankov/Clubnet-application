import { Roles } from 'constants/userRoles';
import { useAuth } from 'store/store';

interface IUserRoles {
  isAdmin: boolean;
  isUser: boolean;
}

export const useUserRole = (): IUserRoles => {
  const { user } = useAuth((state) => state);

  const isAdmin = user?.role === Roles.ADMIN;
  const isUser = user?.role === Roles.USER;

  return { isAdmin, isUser };
};
