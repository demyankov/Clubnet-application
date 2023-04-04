import { useSelector } from 'react-redux';

import { RootStateType } from 'store/index';
import { UserStateType } from 'store/userSlice';

interface IUseAuth extends UserStateType {
  isAuth: boolean;
}

export const useAuth = (): IUseAuth => {
  const { email, token, id } = useSelector((state: RootStateType) => state.user);

  return {
    isAuth: !!email,
    email,
    token,
    id,
  };
};
