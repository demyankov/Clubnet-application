import { produce } from 'immer';

import { Roles } from 'constants/userRoles';
import { successNotification, errorNotification } from 'helpers';
import { appSignIn } from 'integrations/firebase/auth';
import { getUserData, setUserData } from 'integrations/firebase/usersDatabase';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';
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
          const userData = await getUserData(user);

          if (!userData) {
            const { uid, phoneNumber, displayName, photoURL } = user;

            setUserData({
              id: uid,
              phone: phoneNumber as string,
              name: displayName as string,
              image: photoURL,
              role: Roles.USER,
            });
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
