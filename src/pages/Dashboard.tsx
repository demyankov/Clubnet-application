import { FC } from 'react';

import { Navigate } from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';

const Dashboard: FC = () => {
  const { isAuth } = useAuth();

  return isAuth ? <div>Dashboard page</div> : <Navigate to="/" />;
};

export default Dashboard;
