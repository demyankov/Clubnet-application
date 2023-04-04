import { FC } from 'react';

import { LoginForm } from 'components/LoginForm';
import s from 'pages/auth.module.css';

const Login: FC = () => {
  return (
    <div className={s.authForm}>
      <LoginForm />
    </div>
  );
};

export default Login;
