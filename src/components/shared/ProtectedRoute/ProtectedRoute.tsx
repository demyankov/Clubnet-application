import { FC, ReactElement } from 'react';

import { Navigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { useAuth } from 'store/store';

export const ProtectedRoute: FC<{ children: ReactElement; isPrivate?: boolean }> = ({
  children,
  isPrivate,
}) => {
  const { isAuth } = useAuth((state) => state);

  if (isPrivate) {
    return isAuth ? (children as ReactElement) : <Navigate to={Paths.home} replace />;
  }

  return isAuth ? <Navigate to={Paths.home} replace /> : (children as ReactElement);
};
