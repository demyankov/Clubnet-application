import { FC } from 'react';

import s from 'components/auth.module.css';
import { LoginForm } from 'components/LoginForm';

const Login: FC = () => {
  return (
    <div className={s.authForm}>
      <LoginForm />
    </div>
  );
};

export default Login;
