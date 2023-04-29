import { notifications } from '@mantine/notifications';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { Roles } from 'constants/userRoles';
import { TF } from 'helpers/notifications/types';
import { getUserData } from 'integrations/firebase/usersDatabase';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface IUser {
  id: string;
  phone: Nullable<string>;
  name: Nullable<string>;
  image: Nullable<string>;
  role: Roles;
}

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
    set((state) => ({
      ...state,
      isFetching: true,
    }));

    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getUserData(user);

          if (userData) {
            set((state) => ({
              ...state,
              user: {
                id: userData.id,
                phone: userData.phone,
                name: userData.name,
                image: userData.image,
                role: userData.role,
              },
              isAuth: true,
            }));
          }
        } catch (error) {
          notifications.show({
            title: t('notifications.error-header'),
            message: t('notifications.signin-error'),
            color: 'red',
          });
        }
      }
      set((state) => ({
        ...state,
        isFetching: false,
      }));
    });
  },
});
