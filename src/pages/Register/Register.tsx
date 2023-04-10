import { FC } from 'react';

import { Navigate } from 'react-router-dom';

import { RegisterForm } from 'components';
import { Paths } from 'constants/paths';
import { useAuth } from 'hooks/useAuth';
import s from 'pages/auth.module.css';

export const Register: FC = () => {
  const { isAuth } = useAuth();

  return isAuth ? (
    <Navigate to={Paths.home} />
  ) : (
    <div className={s.authForm}>
      <RegisterForm />
    </div>
  );
};
