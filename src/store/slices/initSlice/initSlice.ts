import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

interface AppUser {
  id: string;
  phone: Nullable<string>;
  name: Nullable<string>;
  image: Nullable<string>;
}

export interface IState {
  isAuth: boolean;
  isFetching: boolean;
  user: Nullable<AppUser>;

  getUser: () => Promise<void>;
}

export const initSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isFetching: false,
  user: null,
  isAuth: false,

  getUser: async () => {
    set((state) => ({
      ...state,
      isFetching: true,
    }));

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
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
        }));
      }
      set((state) => ({
        ...state,
        isFetching: false,
      }));
    });
  },
});
