import { Dispatch, SetStateAction } from 'react';

export enum SignInSteps {
  EnterPhoneNumber,
  ConfirmCode,
}

export type LoginViewsProps = {
  setCurrentStep: Dispatch<SetStateAction<SignInSteps>>;
};
