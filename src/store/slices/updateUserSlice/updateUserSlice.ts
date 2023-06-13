import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { StorageFolders } from 'constants/storageFolders';
import { errorHandler } from 'helpers';
import {
  deleteImageFromStorage,
  updateFirestoreData,
  uploadImageAndGetURL,
} from 'integrations/firebase';
import { BoundStore } from 'store/store';
import { EditableUserFields, GenericStateCreator, IUser } from 'store/types';

export interface IUpdateUser {
  isUserImageFetching: boolean;
  isUpdateUserInfoFetching: boolean;
  updateUserImage: (image: File) => Promise<void>;
  deleteUserImage: () => Promise<void>;
  updateUserDataField: (updatedUserData: Partial<EditableUserFields>) => Promise<void>;
}

export const updateUserSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isUserImageFetching: false,
  isUpdateUserInfoFetching: false,

  updateUserImage: async (imageFile) => {
    set(
      produce((state: BoundStore) => {
        state.isUserImageFetching = true;
      }),
    );

    const currentUser = get().user as IUser;

    try {
      const image = await uploadImageAndGetURL(
        imageFile,
        StorageFolders.Images.UserPhoto,
        currentUser.id,
      );

      await updateFirestoreData(DatabasePaths.Users, currentUser.id, { image });

      set(
        produce((state: BoundStore) => {
          state.user = { ...currentUser, image };
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isUserImageFetching = false;
        }),
      );
    }
  },

  deleteUserImage: async () => {
    set(
      produce((state: BoundStore) => {
        state.isUserImageFetching = true;
      }),
    );

    const currentUser = get().user as IUser;

    try {
      if (currentUser.image) {
        await deleteImageFromStorage(currentUser.image);
      }

      await updateFirestoreData(DatabasePaths.Users, currentUser.id, { image: null });

      set(
        produce((state: BoundStore) => {
          state.user = { ...currentUser, image: null };
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isUserImageFetching = false;
        }),
      );
    }
  },

  updateUserDataField: async (updatedUserData) => {
    set(
      produce((state: BoundStore) => {
        state.isUpdateUserInfoFetching = true;
      }),
    );

    const currentUser = get().user as IUser;

    try {
      await updateFirestoreData(DatabasePaths.Users, currentUser.id, updatedUserData);

      set(
        produce((state: BoundStore) => {
          state.user = { ...currentUser, ...updatedUserData };
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isUpdateUserInfoFetching = false;
        }),
      );
    }
  },
});
