import { FC } from 'react';

import { RegisterForm } from 'components';
import s from 'pages/auth.module.css';

export const Register: FC = () => {
  return (
    <div className={s.authForm}>
      <RegisterForm />
    </div>
  );
};
