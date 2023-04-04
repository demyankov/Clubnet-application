import { FC } from 'react';

import { Navigate } from 'react-router-dom';

import { ResetPasswordForm } from 'components/ResetPasswordForm';
import { useAuth } from 'hooks/useAuth';
import s from 'pages/auth.module.css';

const Profile: FC = () => {
  const { isAuth } = useAuth();

  return isAuth ? (
    <div className={s.authForm}>
      <ResetPasswordForm />
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default Profile;
