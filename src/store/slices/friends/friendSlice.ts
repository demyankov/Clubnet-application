import {
  DocumentReference,
  QuerySnapshot,
  Timestamp,
  Unsubscribe,
  deleteField,
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
  getFilteredFirestoreData,
  subscribeToCollection,
  updateFirestoreData,
} from 'integrations/firebase';
import { IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

interface IFriendRequest {
  id: string;
  userRef: DocumentReference<IUser>;
  status: FriendStatus;
  timestamp: Timestamp;
}

interface IFriend extends IUser {
  status: FriendStatus;
  timestamp: Timestamp;
}

interface INotifyFriendRequest extends IFriendRequest {
  isViewed: boolean;
}

export interface INotifyFriends extends IFriend {
  isViewed: boolean;
}

export interface IFilterFriends {
  status: FriendStatus;
  [key: string]: string;
}

export interface IFilterStatus {
  id: string;
  [key: string]: string;
}

export interface IRequestData {
  clientId: string;
  playerId: string;
}

export interface IFriends {
  isGetMoreFetching: boolean;
  isChangeStatusFriendFetching: boolean;
  friends: IFriend[];
  friendSent: IFriend[];
  friendRequest: IFriend[];
  notifyFriend: INotifyFriends[];
  totalCountFriend: number;
  totalCountNotify: number;
  showCounter: number;
  querySnapshot: Nullable<QuerySnapshot>;
  getMoreFriends: (id: string, filter?: FriendStatus) => void;
  getFriends: (id: string) => void;
  getFriendStatus: (playerId: string, clientId: string) => Unsubscribe;
  getNotifyFriend: (id: string) => Unsubscribe;
  getSentFriend: (id: string) => Unsubscribe;
  getRequestFriend: (id: string) => Unsubscribe;
  onSubscribeFriends: (
    id: string,
    status: FriendStatus,
    callBack: (data: IFriendRequest[], dataUser: IUser[]) => void,
  ) => Unsubscribe;
  isViewedUpdate: (data: IRequestData, action?: IsViewedActions) => void;
  getFriendsList: (
    id: string,
    filter: Nullable<FriendStatus>,
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
  isGetMoreFetching: false,
  friends: [],
  friendSent: [],
  friendRequest: [],
  notifyFriend: [],
  querySnapshot: null,
  totalCountFriend: 0,
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

    const { data, totalCount, querySnapshot } =
      await getFilteredFirestoreData<IFriendRequest>(
        path,
        friendFilter,
        'and',
        null,
        'status',
        '==',
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
        null,
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
    try {
      const { data, dataFriends, querySnapshot } = await get().getFriendsList(id, null);

      set(
        produce((state: BoundStore) => {
          state.friends = dataFriends.map((friend, index) => ({
            ...friend,
            status: FriendStatus.friend,
            timestamp: data[index].timestamp,
          }));
          state.showCounter = 10;
          state.querySnapshot = querySnapshot;
          state.totalCountFriend = querySnapshot.size;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    }
  },

  onSubscribeFriends: (id, status, callBack) => {
    const query1 = [DatabasePaths.Users, id, DatabasePaths.Friends];
    const path = getCollectionPathUrl(query1);

    const dataFilter: IFilterFriends = {
      status,
    };

    const friendFilter = convertFiltersToArray<Filter<IFriendRequest>, IFilterFriends>(
      dataFilter,
    );

    return subscribeToCollection<IFriendRequest>(
      path,
      friendFilter,
      async (data: IFriendRequest[]) => {
        const dataFriends = await getDataArrayWithRefArray<IUser>(
          data.map((friend) => friend.userRef),
        );

        callBack(data, dataFriends);
      },
      'status',
      'desc',
    );
  },

  getRequestFriend: (id: string) => {
    return get().onSubscribeFriends(id, FriendStatus.request, (data, dataUser) => {
      set(
        produce((state: BoundStore) => {
          state.friendRequest = dataUser.map((friend, index) => ({
            ...friend,
            status: data[index].status,
            timestamp: data[index].timestamp,
          }));
        }),
      );
    });
  },

  getSentFriend: (id: string) => {
    return get().onSubscribeFriends(id, FriendStatus.sent, (data, dataUser) => {
      set(
        produce((state: BoundStore) => {
          state.friendSent = dataUser.map((friend, index) => ({
            ...friend,
            status: data[index].status,
            timestamp: data[index].timestamp,
          }));
        }),
      );
    });
  },

  getNotifyFriend: (id) => {
    const query1 = [DatabasePaths.Users, id, DatabasePaths.Friends];
    const path = getCollectionPathUrl(query1);

    return subscribeToCollection<INotifyFriendRequest>(
      path,
      [],
      async (data: INotifyFriendRequest[]) => {
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
      },
      'isViewed',
      'desc',
    );
  },

  getFriendStatus: (playerId, clientId) => {
    const query = [DatabasePaths.Users, playerId, DatabasePaths.Friends];
    const path = getCollectionPathUrl(query);

    const dataFilter: IFilterStatus = {
      id: clientId,
    };

    const friendFilter = convertFiltersToArray<Filter<IFriendRequest>, IFilterStatus>(
      dataFilter,
    );

    return subscribeToCollection<IFriendRequest>(
      path,
      friendFilter,
      async (data: IFriendRequest[]) => {
        set(
          produce((state: BoundStore) => {
            state.status = data[0] ? data[0].status : FriendStatus.unknown;
          }),
        );
      },
    );
  },

  isViewedUpdate: async (data, action) => {
    const userQuery = [DatabasePaths.Users, data.playerId, DatabasePaths.Friends];
    const userPath = getCollectionPathUrl(userQuery);

    await updateFirestoreData(userPath, data.clientId, {
      isViewed: action === IsViewedActions.remove ? deleteField() : true,
    });
  },
});
