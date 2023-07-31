import { modals } from '@mantine/modals';
import { deleteField, doc, Timestamp } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { FriendStatus } from 'constants/friendStatus';
import { errorHandler, successNotification } from 'helpers';
import {
  deleteFirestoreData,
  getCollectionPathUrl,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { db } from 'integrations/firebase/firebase';
import { IRequestData } from 'store/slices/friends/friendSlice';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface IFriendsRequests {
  status: FriendStatus;
  isChangeStatusFriendFetching: boolean;
  addFriend: (data: IRequestData) => void;
  rejectFriendRemoval: (data: IRequestData) => void;
  removeFriend: (data: IRequestData) => void;
  acceptRequest: (data: IRequestData) => void;
  declineRequest: (data: IRequestData) => void;
}

export const friendsRequestsSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  status: FriendStatus.unknown,
  isChangeStatusFriendFetching: false,

  addFriend: async (data) => {
    try {
      const userQuery = [DatabasePaths.Users, data.playerId, DatabasePaths.Friends];
      const friendQuery = [DatabasePaths.Users, data.clientId, DatabasePaths.Friends];
      const userPath = getCollectionPathUrl(userQuery);
      const friendPath = getCollectionPathUrl(friendQuery);
      const userRef = doc(db, DatabasePaths.Users, data.playerId);
      const friendRef = doc(db, DatabasePaths.Users, data.clientId);
      const timestamp = Timestamp.fromDate(new Date());

      const promises = [
        setFirestoreData(friendPath, data.playerId, {
          userRef,
          status: FriendStatus.sent,
          isViewed: false,
          timestamp,
        }),
        setFirestoreData(userPath, data.clientId, {
          userRef: friendRef,
          status: FriendStatus.request,
          timestamp,
        }),
      ];

      await Promise.all(promises);
      get().getFriendStatus(data.playerId, data.clientId);
      successNotification('requestSent');
    } catch (error) {
      errorHandler(error as Error);
    }
  },

  rejectFriendRemoval: async (data: IRequestData) => {
    const userQuery = [DatabasePaths.Users, data.playerId, DatabasePaths.Friends];
    const friendQuery = [DatabasePaths.Users, data.clientId, DatabasePaths.Friends];
    const userPath = getCollectionPathUrl(userQuery);
    const friendPath = getCollectionPathUrl(friendQuery);

    const promises = [
      deleteFirestoreData(friendPath, data.playerId),
      deleteFirestoreData(userPath, data.clientId),
    ];

    await Promise.all(promises);
  },

  removeFriend: async (data) => {
    try {
      await get().rejectFriendRemoval(data);

      get().getFriendStatus(data.playerId, data.clientId);
      modals.close('removeFriendModal');
      successNotification('successfullyRemoved');
      set(
        produce((state: BoundStore) => {
          state.status = FriendStatus.unknown;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    }
  },

  acceptRequest: async (data) => {
    set(
      produce((state: BoundStore) => {
        state.isChangeStatusFriendFetching = true;
      }),
    );
    try {
      const userQuery = [DatabasePaths.Users, data.playerId, DatabasePaths.Friends];
      const friendQuery = [DatabasePaths.Users, data.clientId, DatabasePaths.Friends];
      const userPath = getCollectionPathUrl(userQuery);
      const friendPath = getCollectionPathUrl(friendQuery);
      const timestamp = Timestamp.fromDate(new Date());

      const promises = [
        updateFirestoreData(friendPath, data.playerId, {
          status: FriendStatus.friend,
          timestamp,
          isViewed: false,
        }),
        updateFirestoreData(userPath, data.clientId, {
          status: FriendStatus.friend,
          timestamp,
          isViewed: deleteField(),
        }),
      ];

      await Promise.all(promises);
      get().getFriends(data.clientId);
      get().getFriendRequests(data.clientId, FriendStatus.sent);
      get().getTotalCount(data.clientId);
      get().getFriendStatus(data.playerId, data.clientId);
      successNotification('successfullyAdded');
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isChangeStatusFriendFetching = false;
        }),
      );
    }
  },

  declineRequest: async (data) => {
    set(
      produce((state: BoundStore) => {
        state.isChangeStatusFriendFetching = true;
      }),
    );
    try {
      await get().rejectFriendRemoval(data);
      get().getFriendRequests(data.clientId, FriendStatus.sent);
      get().getTotalCount(data.clientId);
      get().getFriendStatus(data.playerId, data.clientId);
      successNotification('requestDeclined');
      set(
        produce((state: BoundStore) => {
          state.status = FriendStatus.unknown;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isChangeStatusFriendFetching = false;
        }),
      );
    }
  },
});
