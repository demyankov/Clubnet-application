import { FC, ReactElement, ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { useAuth } from 'store';

export const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth((state) => ({
    user: state.user,
  }));
  const { isAuth } = user;

  return isAuth ? (children as ReactElement) : <Navigate to={Paths.home} />;
};
