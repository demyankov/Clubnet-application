import { signOut } from 'firebase/auth';
import { produce } from 'immer';

import { SignInSteps } from 'components/Login/types';
import { errorHandler } from 'helpers';
import { auth } from 'integrations/firebase/firebase';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface ISignOut {
  signOut: {
    signOut: () => Promise<void>;
  };
}

export const signOutSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  signOut: {
    signOut: async () => {
      set(
        produce((state: BoundStore) => {
          state.isFetching = true;
        }),
      );

      try {
        await signOut(auth);
        set(
          produce((state: BoundStore) => {
            state.isAuth = false;
            state.user = null;
            state.signIn.currentStep = SignInSteps.EnterPhoneNumber;
          }),
        );
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BoundStore) => {
            state.isFetching = false;
          }),
        );
      }
    },
  },
});
