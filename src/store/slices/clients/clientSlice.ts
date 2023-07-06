import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler } from 'helpers';
import { formatPhoneNumber } from 'helpers/formatters';
import {
  Filter,
  getFirestoreData,
  getFireStoreDataByFieldName,
} from 'integrations/firebase';
import { IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

type ClientFilter = {
  fio?: string;
  phone?: string;
  nickname?: string;
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
  filters: Filter<string>[];
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

  getClients: async (filter) => {
    set(
      produce((state: BoundStore) => {
        state.isClientsFetching = true;
      }),
    );

    try {
      const filters: Filter<string>[] = [];

      if (filter?.phone) {
        filters.push({
          field: 'phone',
          value: formatPhoneNumber(filter.phone),
        });
      }

      if (filter?.nickname) {
        filters.push({
          field: 'nickName',
          value: filter.nickname,
        });
      }

      if (filter?.fio) {
        filters.push({
          field: 'name',
          value: filter.fio,
        });
      }

      const { data, totalCount, querySnapshot } = await getFirestoreData<IUser, string>(
        DatabasePaths.Users,
        filters,
      );

      set(
        produce((state: BoundStore) => {
          state.clients = data;
          state.totalCount = totalCount;
          state.querySnapshot = querySnapshot;
          state.filters = filters;
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

      const lastVisible = get().querySnapshot?.docs[get().querySnapshot.docs.length - 1];

      const { data, totalCount, querySnapshot } = await getFirestoreData<IUser, string>(
        DatabasePaths.Users,
        get().filters,
        // TODO: fix any
        lastVisible as any,
        get().totalCount,
      );

      set(
        produce((state: BoundStore) => {
          state.clients = get().filters.length ? data : [...state.clients, ...data];
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
});
