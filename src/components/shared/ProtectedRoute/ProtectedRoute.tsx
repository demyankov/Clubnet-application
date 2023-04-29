import { FC, ReactElement } from 'react';

import { Navigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import { useAuth } from 'store/store';

export const ProtectedRoute: FC<{
  children: ReactElement;
  isPrivate?: boolean;
  roles: Roles[];
}> = ({ children, isPrivate, roles }) => {
  const { isAuth, user } = useAuth((state) => state);

  const userHasRequiredRole = user?.role !== undefined && roles.includes(user.role);

  if (isPrivate) {
    if (isAuth && userHasRequiredRole) {
      return children as ReactElement;
    }

    return <Navigate to={Paths.home} replace />;
  }

  if (isAuth) {
    return <Navigate to={Paths.home} replace />;
  }

  return children as ReactElement;
};
