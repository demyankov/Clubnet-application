import { FC } from 'react';

import { LoginForm } from 'components';
import s from 'pages/auth.module.css';

export const Login: FC = () => {
  return (
    <div className={s.authForm}>
      <LoginForm />
    </div>
  );
};
