import { signOut } from 'firebase/auth';

import { auth } from 'integrations/firebase/firebase';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IError } from 'store/types';

export interface ISignOut {
  signOut: {
    error: Nullable<string>;
    signOut: () => Promise<void>;
  };
}

export const signOutSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  signOut: {
    error: null,

    signOut: async () => {
      set((state) => ({
        ...state,
        isFetching: true,
        signOut: {
          ...state.signOut,
        },
      }));

      try {
        await signOut(auth);

        set((state) => ({
          ...state,
          user: null,
          isAuth: false,
        }));
      } catch (error) {
        set((state) => ({
          ...state,
          signOut: {
            ...state.signOut,
            error: (error as IError).message,
          },
        }));
      } finally {
        set((state) => ({
          ...state,
          isFetching: false,
        }));
      }
    },
  },
});
