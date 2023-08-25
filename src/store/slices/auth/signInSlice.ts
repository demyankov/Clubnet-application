// eslint-disable-next-line import/no-unresolved
import { SetFieldError } from '@mantine/form/lib/types';
import { t } from 'i18next';
import { produce } from 'immer';
import { NavigateFunction } from 'react-router-dom';

import { SignInSteps } from 'components/Login/types';
import { DatabasePaths } from 'constants/databasePaths';
import { Paths } from 'constants/paths';
import { Roles } from 'constants/userRoles';
import { errorHandler, errorNotification, sleep, successNotification } from 'helpers';
import {
  loginWithCustomToken,
  appGetOTP,
  appSignIn,
  generateRecaptcha,
} from 'integrations/firebase/auth';
import {
  checkFieldValueExists,
  getFireStoreDataByFieldName,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase/database';
import { EditableUserFields, IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface ISignIn {
  signIn: {
    isFetching: boolean;
    isError: boolean;
    isCompletedRegistration: boolean;
    currentStep: SignInSteps;
    sendSmsCode: (phone: string) => Promise<void>;
    checkSmsCode: (code: string, setFieldError?: SetFieldError<any>) => Promise<void>;
    nickNameExists: (
      nickName: string,
      setFieldError: SetFieldError<EditableUserFields>,
    ) => Promise<void>;
    setCurrentStep: (step: SignInSteps) => void;
    appSingInWithCustomToken: (
      uid: Nullable<string>,
      token: string,
      navigate: NavigateFunction,
    ) => void;
    addSteamIdForUser: (
      uid: Nullable<string>,
      steamId: string,
      navigate: NavigateFunction,
    ) => void;
  };
}

export const signInSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  signIn: {
    isFetching: false,
    isError: false,
    isCompletedRegistration: false,
    currentStep: SignInSteps.EnterPhoneNumber,
    // TODO: add setFieldError

    sendSmsCode: async (phone) => {
      set(
        produce((state: BoundStore) => {
          state.signIn.isFetching = true;
          state.signIn.isError = false;
        }),
      );

      try {
        generateRecaptcha();

        await appGetOTP(phone);

        set(
          produce((state) => {
            state.signIn.currentStep = SignInSteps.ConfirmCode;
          }),
        );
      } catch (error) {
        set(
          produce((state: BoundStore) => {
            state.signIn.isError = true;
          }),
        );

        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BoundStore) => {
            state.signIn.isFetching = false;
          }),
        );
      }
    },

    checkSmsCode: async (code) => {
      set(
        produce((state: BoundStore) => {
          state.signIn.isFetching = true;
          state.signIn.isError = false;
        }),
      );

      try {
        const user = await appSignIn(code);

        if (user) {
          const userId = `user-${user.uid}`;
          const userData = await getFireStoreDataByFieldName<IUser>(
            DatabasePaths.Users,
            userId,
          );

          if (userData) {
            set(
              produce((state: BoundStore) => {
                state.signIn.isCompletedRegistration = true;
              }),
            );

            return;
          }

          const candidate: Partial<IUser> = {
            id: userId,
            phone: user.phoneNumber,
            role: Roles.USER,
          };

          set(
            produce((state: BoundStore) => {
              state.user = candidate as IUser;
              state.signIn.currentStep = SignInSteps.SetNickName;
            }),
          );
        }
      } catch (error) {
        set(
          produce((state: BoundStore) => {
            state.signIn.isError = true;
          }),
        );
      } finally {
        set(
          produce((state: BoundStore) => {
            state.signIn.isFetching = false;
          }),
        );
      }
    },

    nickNameExists: async (nickName, setFieldError) => {
      try {
        set(
          produce((state: BoundStore) => {
            state.signIn.isFetching = true;
          }),
        );

        const isNicknameExists = await checkFieldValueExists(
          DatabasePaths.Users,
          'nickName',
          nickName,
        );

        if (isNicknameExists) {
          setFieldError('nickName', t('form.nicknameExists'));

          return;
        }

        const currentUser = get().user as IUser;

        await setFirestoreData<IUser>(DatabasePaths.Users, currentUser.id, {
          ...currentUser,
          nickName,
        });

        set(
          produce((state: BoundStore) => {
            state.isAuth = true;
            state.signIn.isCompletedRegistration = true;
            (state.user as IUser).nickName = nickName;
          }),
        );

        successNotification('successSignin');
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BoundStore) => {
            state.signIn.isFetching = false;
          }),
        );
      }
    },

    setCurrentStep: (step) => {
      set(
        produce((state: BoundStore) => {
          state.signIn.currentStep = step;
        }),
      );
    },

    appSingInWithCustomToken: async (uid, token, navigate) => {
      try {
        if (uid) {
          await sleep(1000);

          errorNotification('errorAddedSteamAccount');
          navigate(Paths.profile);

          return;
        }

        await loginWithCustomToken(token);
        navigate(Paths.profile);
      } catch (error) {
        errorHandler(error as Error);
      }
    },

    addSteamIdForUser: async (uid, steamId, navigate) => {
      try {
        if (!uid) {
          await sleep(1000);

          errorNotification('errorAddedSteamAccount');
          navigate(Paths.signin);

          return;
        }

        await updateFirestoreData(DatabasePaths.Users, uid, {
          steamId,
        });
        successNotification('addedSteamAccount');
        navigate(Paths.profile);
      } catch (error) {
        errorHandler(error as Error);
      }
    },
  },
});
