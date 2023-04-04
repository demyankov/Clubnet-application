import { FC } from 'react';

import { Navigate } from 'react-router-dom';

import { LoginForm } from 'components/LoginForm';
import { useAuth } from 'hooks/useAuth';
import s from 'pages/auth.module.css';

const Login: FC = () => {
  const { isAuth } = useAuth();

  return isAuth ? (
    <Navigate to="/" />
  ) : (
    <div className={s.authForm}>
      <LoginForm />
    </div>
  );
};

export default Login;
