import { signOut } from 'firebase/auth';
import { produce } from 'immer';

import { errorNotification } from 'helpers';
import { auth } from 'integrations/firebase/firebase';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';
import { TF } from 'types/translation';

export interface ISignOut {
  signOut: {
    signOut: (t: TF) => Promise<void>;
  };
}

export const signOutSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  signOut: {
    signOut: async (t) => {
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
          }),
        );
      } catch (error) {
        errorNotification(t);
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
