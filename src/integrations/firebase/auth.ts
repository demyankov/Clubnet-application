import {
  ConfirmationResult,
  RecaptchaVerifier,
  User,
  signInWithPhoneNumber,
} from 'firebase/auth';

import { auth } from 'integrations/firebase/firebase';

interface IExtendedWindow extends Window {
  recaptchaVerifier: RecaptchaVerifier;
  confirmationResult: ConfirmationResult;
}
const extendedWindow = window as unknown as IExtendedWindow;

export const generateRecaptcha = (): void => {
  extendedWindow.recaptchaVerifier = new RecaptchaVerifier(
    'captcha',
    {
      size: 'invisible',
    },
    auth,
  );
};

export const appGetOTP = async (phone: string): Promise<void> => {
  const appVerifier = extendedWindow.recaptchaVerifier;

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);

    extendedWindow.confirmationResult = confirmationResult;
  } catch (error) {
    extendedWindow.recaptchaVerifier.clear();
    throw error;
  }
};

export const appSignIn = async (code: string): Promise<User> => {
  const { user } = await extendedWindow.confirmationResult.confirm(code);

  return user;
};
