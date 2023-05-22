import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { Roles } from 'constants/userRoles';
import { errorNotification, successNotification } from 'helpers';
import { getFirebaseDataById, setFirebaseData } from 'integrations/firebase';
import { appSignIn } from 'integrations/firebase/auth';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IUser } from 'store/types';
import { TF } from 'types/translation';

export interface ISignIn {
  signIn: {
    isFetching: boolean;
    signIn: (code: string, t: TF) => Promise<void>;
  };
}

export const signInSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  signIn: {
    isFetching: false,

    signIn: async (code, t: TF) => {
      set(
        produce((state: BoundStore) => {
          state.signIn.isFetching = true;
        }),
      );

      try {
        const user = await appSignIn(code);

        if (user) {
          const userData = await getFirebaseDataById(DatabasePaths.Users, user.uid);

          if (!userData) {
            const { uid, phoneNumber, displayName, photoURL } = user;

            setFirebaseData<IUser>(
              {
                id: uid,
                phone: phoneNumber as string,
                name: displayName as string,
                image: photoURL,
                role: Roles.USER,
              },
              DatabasePaths.Users,
              uid,
            );
          }

          set(
            produce((state: BoundStore) => {
              state.isAuth = true;
            }),
          );

          successNotification(t, 'successSignin');
        }
      } catch (error) {
        errorNotification(t, 'errorSignin');
      } finally {
        set(
          produce((state: BoundStore) => {
            state.signIn.isFetching = false;
          }),
        );
      }
    },
  },
});
