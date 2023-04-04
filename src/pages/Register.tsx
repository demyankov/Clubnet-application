import { FC } from 'react';

import s from 'components/auth.module.css';
import { RegisterForm } from 'components/RegisterForm';

const Register: FC = () => {
  return (
    <div className={s.authForm}>
      <RegisterForm />
    </div>
  );
};

export default Register;
