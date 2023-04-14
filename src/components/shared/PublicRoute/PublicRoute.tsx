import { FC, ReactElement, ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { Paths } from 'constants/paths';
import { useStore } from 'store';

export const PublicRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useStore((state) => state);
  const { isAuth } = user;

  return isAuth ? <Navigate to={Paths.home} /> : (children as ReactElement);
};
