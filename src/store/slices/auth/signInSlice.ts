import { produce } from 'immer';

import { SignInSteps } from 'components/Login/types';
import { DatabasePaths } from 'constants/databasePaths';
import { Roles } from 'constants/userRoles';
import { errorHandler, successNotification } from 'helpers';
import { appGetOTP, appSignIn, generateRecaptcha } from 'integrations/firebase/auth';
import {
  getFirestoreDataByValue,
  setFirestoreData,
} from 'integrations/firebase/database';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IUser } from 'store/types';

export interface ISignIn {
  signIn: {
    isFetching: boolean;
    isError: boolean;
    isCompletedRegistration: boolean;
    currentStep: SignInSteps;
    signIn: (code: string) => Promise<void>;
    setNickName: (nickName: string) => Promise<void>;
    nickNameExists: (nickName: string) => Promise<boolean | undefined>;
    sendOTP: (phone: string) => Promise<void>;
    setCurrentStep: (step: SignInSteps) => void;
  };
}

export const signInSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  signIn: {
    isFetching: false,
    isError: false,
    isCompletedRegistration: false,
    currentStep: SignInSteps.EnterPhoneNumber,

    signIn: async (code) => {
      set(
        produce((state: BoundStore) => {
          state.signIn.isFetching = true;
          state.signIn.isError = false;
        }),
      );

      try {
        const user = await appSignIn(code);

        if (user) {
          const userData: IUser = await getFirestoreDataByValue(
            DatabasePaths.Users,
            user.uid,
          );

          if (userData) {
            set(
              produce((state: BoundStore) => {
                state.isAuth = true;
                state.signIn.isCompletedRegistration = true;
                state.user = { ...userData };
              }),
            );
          }

          const candidate: Partial<IUser> = {
            id: user.uid,
            phone: user.phoneNumber,
            role: Roles.USER,
          };

          set(
            produce((state: BoundStore) => {
              state.user = { ...(state.user as IUser), ...candidate };
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

    sendOTP: async (phone) => {
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

    setNickName: async (nickName) => {
      set(
        produce((state: BoundStore) => {
          state.signIn.isFetching = true;
        }),
      );

      const currentUser = get().user as IUser;

      try {
        setFirestoreData(DatabasePaths.Users, currentUser.id, {
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

    nickNameExists: async (nickName) => {
      try {
        set(
          produce((state: BoundStore) => {
            state.signIn.isFetching = true;
          }),
        );
        const foundNickName = await getFirestoreDataByValue(
          DatabasePaths.Users,
          nickName,
        );

        return !!foundNickName;
      } catch (e) {
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

    setCurrentStep: (step) => {
      set(
        produce((state: BoundStore) => {
          state.signIn.currentStep = step;
        }),
      );
    },
  },
});
