import { LoginConfirmCode } from 'components/Login/ConfirmCode/LoginConfirmCode';
import { LoginEnterPhoneNumber } from 'components/Login/EnterPhoneNumber/LoginEnterPhoneNumber';
import { SignInSteps } from 'components/Login/types';

export const SIGN_IN_STEP_VIEWS: Record<SignInSteps, any> = {
  [SignInSteps.EnterPhoneNumber]: LoginEnterPhoneNumber,
  [SignInSteps.ConfirmCode]: LoginConfirmCode,
};
