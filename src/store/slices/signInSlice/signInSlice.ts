import { appSignIn } from 'integrations/firebase/phoneAuth';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IError } from 'store/types';

export interface ISignIn {
  signIn: {
    isFetching: boolean;
    error: Nullable<string>;

    signIn: (code: string) => Promise<void>;
  };
}

export const signInSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  signIn: {
    isFetching: false,
    error: null,

    signIn: async (code) => {
      set((state) => ({
        state,
        signIn: {
          ...state.signIn,
          isFetching: true,
        },
      }));

      try {
        const user = await appSignIn(code);

        if (user) {
          set((state) => ({
            ...state,
            user: {
              id: user.uid,
              phone: user.phoneNumber,
              name: user.displayName,
              image: user.photoURL,
            },
            isAuth: true,
            signIn: {
              ...state.signIn,
              isFetching: false,
            },
          }));
        }
      } catch (error) {
        set((state) => ({
          ...state,
          signIn: {
            ...state.signIn,
            isFetching: false,
            error: (error as IError).message,
          },
        }));
      }
    },
  },
});
