import { FC } from 'react';

import { Navigate } from 'react-router-dom';

import { RegisterForm } from 'components/RegisterForm';
import { useAuth } from 'hooks/useAuth';
import s from 'pages/auth.module.css';

const Register: FC = () => {
  const { isAuth } = useAuth();

  return isAuth ? (
    <Navigate to="/" />
  ) : (
    <div className={s.authForm}>
      <RegisterForm />
    </div>
  );
};

export default Register;
