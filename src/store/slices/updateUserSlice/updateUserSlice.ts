import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { errorNotification } from 'helpers';
import { uploadImageAndGetURL, updateFirebaseData } from 'integrations/firebase';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IUser, EditableUserFields } from 'store/types';
import { TF } from 'types/translation';

export interface IUpdateUser {
  isUserImageFetching: boolean;
  isUpdateUserInfoFetching: boolean;
  updateUserImage: (image: File, t: TF) => Promise<void>;
  deleteUserImage: (t: TF) => Promise<void>;
  updateUserDataField: (
    updatedUserData: Partial<EditableUserFields>,
    t: TF,
  ) => Promise<void>;
}

export const updateUserSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isUserImageFetching: false,
  isUpdateUserInfoFetching: false,

  updateUserImage: async (imageFile, t) => {
    set(
      produce((state: BoundStore) => {
        state.isUserImageFetching = true;
      }),
    );

    const currentUser = get().user as IUser;

    try {
      const image = await uploadImageAndGetURL(imageFile, currentUser.id);

      await updateFirebaseData<IUser>(
        DatabasePaths.Users,
        {
          ...currentUser,
          image,
        },
        currentUser.id,
      );

      set(
        produce((state: BoundStore) => {
          state.user = { ...currentUser, image };
        }),
      );
    } catch (error) {
      errorNotification(t);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isUserImageFetching = false;
        }),
      );
    }
  },

  deleteUserImage: async (t) => {
    set(
      produce((state: BoundStore) => {
        state.isUserImageFetching = true;
      }),
    );

    const currentUser = get().user as IUser;

    try {
      await updateFirebaseData<IUser>(
        DatabasePaths.Users,
        {
          ...currentUser,
          image: null,
        },
        currentUser.id,
      );

      set(
        produce((state: BoundStore) => {
          state.user = { ...currentUser, image: null };
        }),
      );
    } catch (error) {
      errorNotification(t);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isUserImageFetching = false;
        }),
      );
    }
  },

  updateUserDataField: async (updatedUserData, t) => {
    set(
      produce((state: BoundStore) => {
        state.isUpdateUserInfoFetching = true;
      }),
    );

    const currentUser = get().user as IUser;

    try {
      await updateFirebaseData<IUser>(
        DatabasePaths.Users,
        {
          ...currentUser,
          ...updatedUserData,
        },
        currentUser.id,
      );

      set(
        produce((state: BoundStore) => {
          state.user = { ...currentUser, ...updatedUserData };
        }),
      );
    } catch (error) {
      errorNotification(t);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isUpdateUserInfoFetching = false;
        }),
      );
    }
  },
});
