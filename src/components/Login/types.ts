import { Dispatch, SetStateAction } from 'react';

export enum SignInSteps {
  EnterPhoneNumber,
  ConfirmCode,
  SetNickName,
}

export type LoginViewsProps = {
  tempPhone: string;
  setTempPhone: Dispatch<SetStateAction<string>>;
  resetRecaptchaWidget: () => void;
};
