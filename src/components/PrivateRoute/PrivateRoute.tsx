import { FC, ReactElement, ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { useAuth } from 'hooks/useAuth';

export const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuth } = useAuth();

  return isAuth ? (children as ReactElement) : <Navigate to={Paths.home} />;
};
