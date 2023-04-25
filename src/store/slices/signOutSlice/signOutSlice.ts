import { appSignOut } from 'integrations/firebase/phoneAuth';
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
        await appSignOut();
        set((state) => ({
          ...state,
          user: null,
          isAuth: false,
          isFetching: false,
        }));
      } catch (error) {
        set((state) => ({
          ...state,
          isFetching: false,
          signOut: {
            ...state.signOut,
            error: (error as IError).message,
          },
        }));
      }
    },
  },
});
