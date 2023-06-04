import { FC } from 'react';

import { LoginConfirmCode } from 'components/Login/ConfirmCode/LoginConfirmCode';
import { LoginEnterPhoneNumber } from 'components/Login/EnterPhoneNumber/LoginEnterPhoneNumber';
import { LoginSetNickName } from 'components/Login/SetNickName/LoginSetNickName';
import { LoginViewsProps, SignInSteps } from 'components/Login/types';

export const SIGN_IN_STEP_VIEWS: Record<SignInSteps, FC<LoginViewsProps>> = {
  [SignInSteps.EnterPhoneNumber]: LoginEnterPhoneNumber,
  [SignInSteps.ConfirmCode]: LoginConfirmCode,
  [SignInSteps.SetNickName]: LoginSetNickName,
};
