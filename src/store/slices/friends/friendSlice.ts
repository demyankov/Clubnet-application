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
  Unsubscribe,
} from 'firebase/firestore';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { FriendStatus } from 'constants/friendStatus';
import { IsViewedActions } from 'constants/isViewedActions';
import { errorHandler } from 'helpers';
import { convertFiltersToArray } from 'helpers/convertFiltersToArray';
import {
  Filter,
  getCollectionPathUrl,
  getDataArrayWithRefArray,
  getFirestoreData,
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

export interface IRequestData {
  clientId: string;
  playerId: string;
}

export interface IFriends {
  isFriendsFetching: boolean;
  isFriendRequestsFetching: boolean;
  isGetMoreFetching: boolean;
  isStatusFetching: boolean;
  isChangeStatusFriendFetching: boolean;
  isTotalCountFriendsFetching: boolean;
  friends: IFriend[];
  friendRequests: IFriend[];
  notifyFriend: INotifyFriends[];
  totalCountFriend: number;
  totalCountSent: number;
  totalCountRequest: number;
  totalCountNotify: number;
  showCounter: number;
  querySnapshot: Nullable<QuerySnapshot>;
  getMoreFriends: (id: string, filter?: FriendStatus) => void;
  getFriends: (id: string) => void;
  getFriendRequests: (id: string, filter: FriendStatus) => void;
  getFriendStatus: (playerId: string, clientId: string) => void;
  getTotalCount: (id: string) => void;
  getNotifyFriend: (id: string) => Unsubscribe;
  isViewedUpdate: (data: IRequestData, action?: IsViewedActions) => void;
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
  isTotalCountFriendsFetching: false,
  friends: [],
  friendRequests: [],
  notifyFriend: [],
  querySnapshot: null,
  totalCountFriend: 0,
  totalCountSent: 0,
  totalCountRequest: 0,
  totalCountNotify: 0,
  showCounter: 10,

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
      const { data, dataFriends, querySnapshot } = await get().getFriendsList(id);

      set(
        produce((state: BoundStore) => {
          state.friends = dataFriends.map((friend, index) => ({
            ...friend,
            status: FriendStatus.friend,
            timestamp: data[index].timestamp,
          }));
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

  getTotalCount: async (id) => {
    set(
      produce((state: BoundStore) => {
        state.isTotalCountFriendsFetching = true;
      }),
    );
    try {
      const { totalCount: totalCountFriend } = await get().getFriendsList(id);
      const { totalCount: totalCountSent } = await get().getFriendsList(
        id,
        FriendStatus.sent,
      );
      const { totalCount: totalCountRequest } = await get().getFriendsList(
        id,
        FriendStatus.request,
      );

      set(
        produce((state: BoundStore) => {
          state.totalCountFriend = totalCountFriend;
          state.totalCountSent = totalCountSent;
          state.totalCountRequest = totalCountRequest;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isTotalCountFriendsFetching = false;
        }),
      );
    }
  },

  getNotifyFriend: (id) => {
    const query1 = [DatabasePaths.Users, id, DatabasePaths.Friends];
    const path = getCollectionPathUrl(query1);

    const q = query(collection(db, path), orderBy('isViewed', 'desc'));

    return onSnapshot(q, async (querySnapshot) => {
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
});
