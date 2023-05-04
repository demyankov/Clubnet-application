import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { produce } from 'immer';

import { errorNotification } from 'helpers';
import { getUserData } from 'integrations/firebase/usersDatabase';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IUser } from 'store/types';
import { TF } from 'types/translation';

export interface IState {
  isAuth: boolean;
  isFetching: boolean;
  user: Nullable<IUser>;
  getUser: (t: TF) => Promise<void>;
}

export const initSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isFetching: false,
  user: null,
  isAuth: false,

  getUser: async (t: TF) => {
    set(
      produce((state: BoundStore) => {
        state.isFetching = true;
      }),
    );

    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        set(
          produce((state: BoundStore) => {
            state.isFetching = false;
          }),
        );

        return;
      }

      try {
        set(
          produce((state) => {
            state.isFetching = true;
          }),
        );
        const userData = await getUserData(user);

        if (userData) {
          set(
            produce((state: BoundStore) => {
              state.user = { ...userData };
              state.isAuth = true;
            }),
          );
        }
      } catch (error) {
        errorNotification(t, 'errorSignin');
      } finally {
        set(
          produce((state: BoundStore) => {
            state.isFetching = false;
          }),
        );
      }
    });
  },
});
