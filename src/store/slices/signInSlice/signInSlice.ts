import { notifications } from '@mantine/notifications';

import { Roles } from 'constants/userRoles';
import { TF } from 'helpers/notifications/types';
import { appSignIn } from 'integrations/firebase/phoneAuth';
import { getUserData, setUserData } from 'integrations/firebase/usersDatabase';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

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
          try {
            const userData = await getUserData(user);

            if (!userData) {
              setUserData({
                id: user.uid,
                phone: user.phoneNumber,
                name: user.displayName,
                image: user.photoURL,
                role: Roles.USER,
              });
            }

            notifications.show({
              title: t('notifications.success-header'),
              message: t('notifications.signin-success'),
              color: 'teal',
            });
          } catch (error) {
            notifications.show({
              title: t('notifications.error-header'),
              message: t('notifications.signin-error'),
              color: 'red',
            });
          }
          set((state) => ({
            ...state,
            isAuth: true,
            isFetching: false,
          }));
        }
      } catch (error) {
        notifications.show({
          title: t('notifications.error-header'),
          message: t('notifications.signin-error'),
          color: 'red',
        });
      }
    },
  },
});
