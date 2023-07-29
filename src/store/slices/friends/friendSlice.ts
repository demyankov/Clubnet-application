import {
  collection,
  deleteField,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  Timestamp,
} from 'firebase/firestore';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { FriendStatus } from 'constants/friendStatus';
import { IsViewedActions } from 'constants/isViewedActions';
import { errorHandler, successNotification } from 'helpers';
import { convertFiltersToArray } from 'helpers/convertFiltersToArray';
import {
  deleteFirestoreData,
  Filter,
  getCollectionPathUrl,
  getDataArrayWithRefArray,
  getFirestoreData,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { db } from 'integrations/firebase/firebase';
import { IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

interface IFriendRequest {
  userRef: DocumentReference<IUser>;
  status: FriendStatus;
  timestamp: Timestamp;
}

interface IFriend extends IUser {
  status: FriendStatus;
  timestamp: Timestamp;
}

export interface INotifyFriends extends IFriend {
  isViewed: boolean;
}

export interface IFilterFriends {
  status: FriendStatus;
  [x: string]: string;
}

interface IRequestData {
  clientId: string;
  playerId: string;
}

export interface IFriends {
  isFriendsFetching: boolean;
  isFriendRequestsFetching: boolean;
  isGetMoreFetching: boolean;
  isStatusFetching: boolean;
  friends: IFriend[];
  friendRequests: IFriend[];
  notifyFriend: INotifyFriends[];
  totalCount: number;
  totalCountNotify: number;
  showCounter: number;
  querySnapshot: Nullable<QuerySnapshot>;
  status: FriendStatus;
  addFriend: (data: IRequestData) => void;
  removeFriend: (data: IRequestData) => void;
  acceptRequest: (data: IRequestData) => void;
  declineRequest: (data: IRequestData) => void;
  acceptFriendRequest: (nickname: string) => void;
  getMoreFriends: (id: string, filter?: FriendStatus) => void;
  getFriends: (id: string) => void;
  getFriendRequests: (id: string, filter: FriendStatus) => void;
  getFriendStatus: (playerId: string, clientId: string) => void;
  isViewedUpdate: (data: IRequestData, action?: IsViewedActions) => void;
  getNotifyFriend: (id: string) => void;
  rejectFriendRemoval: (data: IRequestData) => void;
  getFriendsList: (
    id: string,
    filter?: FriendStatus,
    totalCounter?: number,
  ) => Promise<{
    data: IFriendRequest[];
    totalCount: number;
    querySnapshot: QuerySnapshot;
    dataFriends: IUser[];
  }>;
}

export const friendSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isFriendsFetching: false,
  isGetMoreFetching: false,
  isStatusFetching: false,
  friends: [],
  friendRequests: [],
  notifyFriend: [],
  querySnapshot: null,
  totalCount: 0,
  totalCountNotify: 0,
  showCounter: 10,
  status: FriendStatus.unknown,

  getFriendsList: async (id, filter, totalCounter) => {
    const query = [DatabasePaths.Users, id, DatabasePaths.Friends];
    const path = getCollectionPathUrl(query);
    const dataFilter: IFilterFriends = {
      status: filter || FriendStatus.friend,
    };

    const friendFilter = convertFiltersToArray<Filter<IFriendRequest>, IFilterFriends>(
      dataFilter,
    );

    const { data, totalCount, querySnapshot } = await getFirestoreData<IFriendRequest>(
      path,
      friendFilter,
      null,
      totalCounter,
    );

    const dataFriends = await getDataArrayWithRefArray<IUser>(
      data.map((friendRequest) => friendRequest.userRef),
    );

    return { data, dataFriends, totalCount, querySnapshot };
  },

  getMoreFriends: async (id) => {
    try {
      set(
        produce((state: BoundStore) => {
          state.isGetMoreFetching = true;
        }),
      );
      const MORE_FRIEND = 2;

      const totalCounter = get().showCounter * MORE_FRIEND;
      const { data, dataFriends, querySnapshot } = await get().getFriendsList(
        id,
        undefined,
        totalCounter,
      );
      const moreFriends = dataFriends.map((friend, index) => ({
        ...friend,
        status: FriendStatus.friend,
        timestamp: data[index].timestamp,
      }));

      set(
        produce((state: BoundStore) => {
          state.friends = moreFriends;
          state.querySnapshot = querySnapshot;
          state.showCounter = totalCounter;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isGetMoreFetching = false;
        }),
      );
    }
  },

  getFriends: async (id) => {
    set(
      produce((state: BoundStore) => {
        state.isFriendsFetching = true;
      }),
    );

    try {
      const { data, dataFriends, totalCount, querySnapshot } = await get().getFriendsList(
        id,
      );

      set(
        produce((state: BoundStore) => {
          state.friends = dataFriends.map((friend, index) => ({
            ...friend,
            status: FriendStatus.friend,
            timestamp: data[index].timestamp,
          }));
          state.totalCount = totalCount;
          state.showCounter = 10;
          state.querySnapshot = querySnapshot;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFriendsFetching = false;
        }),
      );
    }
  },

  getFriendRequests: async (id, filter) => {
    set(
      produce((state: BoundStore) => {
        state.isFriendRequestsFetching = true;
      }),
    );

    try {
      const { data, dataFriends } = await get().getFriendsList(id, filter);

      set(
        produce((state: BoundStore) => {
          state.friendRequests = dataFriends.map((friend, index) => ({
            ...friend,
            status: filter,
            timestamp: data[index].timestamp,
          }));
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFriendRequestsFetching = false;
        }),
      );
    }
  },

  getNotifyFriend: async (id) => {
    const query1 = [DatabasePaths.Users, id, DatabasePaths.Friends];
    const path = getCollectionPathUrl(query1);

    const q = query(collection(db, path), orderBy('isViewed', 'desc'));

    onSnapshot(q, async (querySnapshot) => {
      const data: DocumentData[] = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      const dataFriends = await getDataArrayWithRefArray<IUser>(
        data.map((friend) => friend.userRef),
      );

      set(
        produce((state: BoundStore) => {
          state.notifyFriend = dataFriends.map((friend, index) => ({
            ...friend,
            status: data[index].status,
            timestamp: data[index].timestamp,
            isViewed: data[index].isViewed,
          }));
          state.totalCountNotify = data.length;
        }),
      );
    });
  },

  getFriendStatus: async (playerId, clientId) => {
    set(
      produce((state: BoundStore) => {
        state.isStatusFetching = true;
      }),
    );

    try {
      const query = [DatabasePaths.Users, playerId, DatabasePaths.Friends];
      const path = getCollectionPathUrl(query);

      const docRef = doc(db, path, clientId);

      const docSnap = await getDoc(docRef);

      set(
        produce((state: BoundStore) => {
          state.status = docSnap.exists() ? docSnap.data().status : FriendStatus.unknown;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isStatusFetching = false;
        }),
      );
    }
  },

  isViewedUpdate: async (data, action) => {
    const userQuery = [DatabasePaths.Users, data.playerId, DatabasePaths.Friends];
    const userPath = getCollectionPathUrl(userQuery);

    await updateFirestoreData(userPath, data.clientId, {
      isViewed: action === IsViewedActions.remove ? deleteField() : true,
    });
  },

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
      get().getFriendRequests(data.clientId, FriendStatus.request);
      get().getFriendStatus(data.playerId, data.clientId);
      successNotification('successfullyAdded');
    } catch (error) {
      errorHandler(error as Error);
    }
  },

  declineRequest: async (data) => {
    try {
      await get().rejectFriendRemoval(data);
      get().getFriendRequests(data.clientId, FriendStatus.request);
      successNotification('requestDeclined');
      set(
        produce((state: BoundStore) => {
          state.status = FriendStatus.unknown;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    }
  },
});
