import { FC } from 'react';

import { Navigate } from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';

const Profile: FC = () => {
  const { isAuth } = useAuth();

  return isAuth ? <div>Profile page</div> : <Navigate to="/" />;
};

export default Profile;
