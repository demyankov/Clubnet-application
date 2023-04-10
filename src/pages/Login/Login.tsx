import { FC } from 'react';

import { Navigate } from 'react-router-dom';

import { LoginForm } from 'components';
import { Paths } from 'constants/paths';
import { useAuth } from 'hooks/useAuth';
import s from 'pages/auth.module.css';

export const Login: FC = () => {
  const { isAuth } = useAuth();

  return isAuth ? (
    <Navigate to={Paths.home} />
  ) : (
    <div className={s.authForm}>
      <LoginForm />
    </div>
  );
};
