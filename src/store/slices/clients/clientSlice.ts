import { getDatabase, push, ref } from 'firebase/database';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler, errorNotification, successNotification } from 'helpers';
import { convertFiltersToArray } from 'helpers/convertFiltersToArray';
import { formatPhoneNumber } from 'helpers/formatters';
import {
  Filter,
  getFirestoreData,
  getFireStoreDataByFieldName,
  setFirestoreData,
} from 'integrations/firebase';
import { IAddUser, IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

type ClientFilter = {
  name?: string;
  phone?: string;
  nickName?: string;
};

export interface IClients {
  isClientsFetching: boolean;
  isGetMoreFetching: boolean;
  clients: IUser[];
  client: Nullable<IUser>;
  addClient: (clientData: IUser) => void;
  getClients: (filter?: ClientFilter) => void;
  getMoreClients: () => void;
  getClientByNickname: (nickname: string) => void;
  getAllFilteredClients: () => void;
  totalCount: number;
  querySnapshot: any;
  filter?: ClientFilter;
  addUser: (user: IAddUser) => void;
}

export const clientSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isClientsFetching: false,
  isGetMoreFetching: false,
  clients: [],
  client: null,
  querySnapshot: null,
  totalCount: 0,
  filters: [],
  filter: {},

  getClients: async () => {
    set(
      produce((state: BoundStore) => {
        state.isClientsFetching = true;
      }),
    );

    try {
      const { filter: currentFilter } = get();

      const filters = convertFiltersToArray<Filter<string>, ClientFilter>(currentFilter);

      const { data, totalCount, querySnapshot } = await getFirestoreData<IUser, string>(
        DatabasePaths.Users,
        filters,
      );

      set(
        produce((state: BoundStore) => {
          state.clients = data;
          state.totalCount = totalCount;
          state.querySnapshot = querySnapshot;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isClientsFetching = false;
        }),
      );
    }
  },

  getClientByNickname: async (nickname) => {
    set(
      produce((state: BoundStore) => {
        state.isClientsFetching = true;
      }),
    );

    try {
      const data = await getFireStoreDataByFieldName<IUser>(
        DatabasePaths.Users,
        nickname,
        'nickName',
      );

      if (data) {
        set(
          produce((state: BoundStore) => {
            state.client = data;
          }),
        );
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isClientsFetching = false;
        }),
      );
    }
  },

  getMoreClients: async () => {
    try {
      set(
        produce((state: BoundStore) => {
          state.isGetMoreFetching = true;
        }),
      );

      const lastVisible: Nullable<QueryDocumentSnapshot> =
        get().querySnapshot?.docs[get().querySnapshot.docs.length - 1];

      const { filter } = get();
      const filters = convertFiltersToArray<Filter<string>, ClientFilter>(filter);

      const { data, totalCount, querySnapshot } = await getFirestoreData<IUser, string>(
        DatabasePaths.Users,
        filters,
        lastVisible,
        get().totalCount,
      );

      set(
        produce((state: BoundStore) => {
          state.clients = filters.length ? data : [...state.clients, ...data];
          state.totalCount = totalCount;
          state.querySnapshot = querySnapshot;
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

  addUser: async (user) => {
    try {
      set(
        produce((state: BoundStore) => {
          state.isClientsFetching = true;
        }),
      );
      const userData = await getFireStoreDataByFieldName<IUser>(
        DatabasePaths.Users,
        formatPhoneNumber(user.phone),
        'phone',
      );

      if (userData) {
        errorNotification('errorAddedUser');

        return;
      }
      const database = getDatabase();
      const usersRef = ref(database, DatabasePaths.Users);
      const newUserKey = push(usersRef).key;

      const newUserId = `user${newUserKey}`;

      await setFirestoreData(DatabasePaths.Users, newUserId, {
        ...user,
        role: 'user',
        id: newUserId,
      });
      get().getClients();
      successNotification('successAddedUser');
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isClientsFetching = false;
        }),
      );
    }
  },
});
