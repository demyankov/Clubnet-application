import { SignInSteps } from './types';

import { LoginConfirmCode } from 'components/Login/ConfirmCode/LoginConfirmCode';
import { LoginEnterPhoneNumber } from 'components/Login/EnterPhoneNumber/LoginEnterPhoneNumber';

export const SIGN_IN_STEP_VIEWS: Record<SignInSteps, any> = {
  [SignInSteps.EnterPhoneNumber]: LoginEnterPhoneNumber,
  [SignInSteps.ConfirmCode]: LoginConfirmCode,
};
