import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler } from 'helpers';
import { getFirestoreDataByValue } from 'integrations/firebase/database';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IUser } from 'store/types';

export interface IState {
  isAuth: boolean;
  isFetching: boolean;
  user: Nullable<IUser>;
  getUser: () => Promise<void>;
}

export const initSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isAuth: false,
  isFetching: false,
  user: null,

  getUser: async () => {
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
        const userData = await getFirestoreDataByValue(DatabasePaths.Users, user.uid);

        if (userData) {
          set(
            produce((state: BoundStore) => {
              state.user = { ...(userData as IUser) };
              state.isAuth = true;
            }),
          );
        }
      } catch (error) {
        errorHandler(error as Error);
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
