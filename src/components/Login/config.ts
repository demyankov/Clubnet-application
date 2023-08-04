import { FC } from 'react';

import { LoginConfirmCode, LoginEnterPhoneNumber, LoginSetNickName } from 'components';
import { LoginViewsProps, SignInSteps } from 'components/Login/types';

export const SIGN_IN_STEP_VIEWS: Record<SignInSteps, FC<LoginViewsProps>> = {
  [SignInSteps.EnterPhoneNumber]: LoginEnterPhoneNumber,
  [SignInSteps.ConfirmCode]: LoginConfirmCode,
  [SignInSteps.SetNickName]: LoginSetNickName,
};
