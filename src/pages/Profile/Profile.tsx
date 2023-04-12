import { FC } from 'react';

import { ResetPasswordForm } from 'components';
import s from 'pages/auth.module.css';

export const Profile: FC = () => {
  return (
    <div className={s.authForm}>
      <ResetPasswordForm />
    </div>
  );
};
