import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler } from 'helpers';
import { getFireStoreDataByFieldName } from 'integrations/firebase/database';
import { db } from 'integrations/firebase/firebase';
import { IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface IState {
  isAuth: boolean;
  isFetching: boolean;
  isAuthInitialized: boolean;
  user: Nullable<IUser>;
  getUser: () => Promise<void>;
}

export const initSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isAuth: false,
  isFetching: false,
  isAuthInitialized: false,
  user: null,

  getUser: async () => {
    set(
      produce((state: BoundStore) => {
        state.isFetching = true;
      }),
    );

    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      set(
        produce((state: BoundStore) => {
          state.isAuthInitialized = true;
        }),
      );

      if (!user) {
        set(
          produce((state: BoundStore) => {
            state.isFetching = false;
          }),
        );

        return;
      }

      try {
        const userId = `user-${user.uid}`;

        localStorage.setItem('userId', userId);

        const userData = await getFireStoreDataByFieldName<IUser>(
          DatabasePaths.Users,
          userId,
        );

        if (userData) {
          set(
            produce((state: BoundStore) => {
              state.user = { ...userData };
              state.isAuth = true;
            }),
          );
        }
        if (userData) {
          onSnapshot(doc(db, DatabasePaths.Users, userData.id), (doc) => {
            const user = doc.data();

            set(
              produce((state: BoundStore) => {
                state.user = { ...(user as IUser) };
              }),
            );
          });
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
