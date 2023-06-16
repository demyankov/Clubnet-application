import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler } from 'helpers';
import { formatPhoneNumber } from 'helpers/formatters';
import {
  Filter,
  getFirestoreData,
  getFireStoreDataByFieldName,
} from 'integrations/firebase';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IUser } from 'store/types';

export interface IClients {
  isClientsFetching: boolean;
  isUpdateClientFetching: boolean;
  clients: IUser[];
  client: Nullable<IUser>;
  addClient: (clientData: IUser) => void;
  // TODO: fix any
  getClients: (filter: any) => void;
  getClientByNickname: (nickname: string) => void;
}

export const clientSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isClientsFetching: false,
  clients: [],
  client: null,

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
          operator: '==',
          value: formatPhoneNumber(filter?.phone),
        });
      }

      if (filter?.nickname) {
        filters.push({ field: 'nickName', operator: '==', value: filter?.nickname });
      }

      const data = await getFirestoreData<IUser, string>(DatabasePaths.Users, filters);

      set(
        produce((state: BoundStore) => {
          state.clients = data;
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
      const data = await getFireStoreDataByFieldName(
        DatabasePaths.Users,
        nickname,
        'nickName',
      );

      set(
        produce((state: BoundStore) => {
          state.client = data;
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
});
