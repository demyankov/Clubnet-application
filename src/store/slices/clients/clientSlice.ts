// eslint-disable-next-line import/no-unresolved
import { SetFieldError } from '@mantine/form/lib/types';
import { modals } from '@mantine/modals';
import { getDatabase, push, ref } from 'firebase/database';
import { QuerySnapshot } from 'firebase/firestore';
import { t } from 'i18next';
import { produce } from 'immer';
import { NavigateFunction } from 'react-router-dom';

import { DatabasePaths } from 'constants/databasePaths';
import { Paths } from 'constants/paths';
import { errorHandler, errorNotification, successNotification } from 'helpers';
import { convertFiltersToArray } from 'helpers/convertFiltersToArray';
import { formatPhoneNumber } from 'helpers/formatters';
import {
  checkFieldValueExists,
  Filter,
  getFilteredFirestoreData,
  getFireStoreDataByFieldName,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { EditableUserFields, IAddUser, IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

type ClientFilter = {
  name?: IUser['name'];
  phone?: IUser['phone'];
  nickName?: IUser['nickName'];
};

export type EditableClientFields = Partial<EditableUserFields>;

export interface IClients {
  isClientsFetching: boolean;
  isGetMoreFetching: boolean;
  clients: IUser[];
  client: Nullable<IUser>;
  addClient: (clientData: IUser) => void;
  updateClientData: (
    updatedClientData: EditableClientFields,
    setFieldError: SetFieldError<EditableClientFields>,
    navigate: NavigateFunction,
  ) => Promise<void>;
  getClients: (filter?: ClientFilter) => void;
  getMoreClients: () => void;
  getClientByNickname: (nickname: string) => void;
  getAllFilteredClients: () => void;
  setFilter: (filter?: ClientFilter) => void;
  totalCount: number;
  querySnapshot: Nullable<QuerySnapshot>;
  filters: Filter<IUser>[];
  addUser: (user: IAddUser, resetForm: () => void) => void;
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

  setFilter: (filter) => {
    const filters = convertFiltersToArray<Filter<IUser>, ClientFilter>(filter);

    set(
      produce((state: BoundStore) => {
        state.filters = filters;
      }),
    );
    get().getClients();
  },

  getClients: async () => {
    set(
      produce((state: BoundStore) => {
        state.isClientsFetching = true;
      }),
    );

    try {
      const { filters } = get();

      const { data, totalCount, querySnapshot } = await getFilteredFirestoreData<IUser>(
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

      const lastVisible = get().querySnapshot?.docs[get().querySnapshot!.docs.length - 1];

      const { filters } = get();

      const { data, querySnapshot } = await getFilteredFirestoreData<IUser>(
        DatabasePaths.Users,
        filters,
        'and',
        lastVisible,
      );

      set(
        produce((state: BoundStore) => {
          state.clients = filters.length ? data : [...state.clients, ...data];
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

  addUser: async (user, resetForm) => {
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
      modals.close('addClientsModal');
      resetForm();
      successNotification('successAddedUser');
      get().getClients();
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
  updateClientData: async (updatedClientData, setFieldError, navigate) => {
    set(
      produce((state: BoundStore) => {
        state.isClientsFetching = true;
      }),
    );

    if (updatedClientData.nickName) {
      const isNicknameExists = await checkFieldValueExists(
        DatabasePaths.Users,
        'nickName',
        updatedClientData.nickName,
      );

      if (isNicknameExists) {
        setFieldError('nickName', t('form.nicknameExists'));

        return;
      }
    }

    const currentClient = get().client as IUser;

    try {
      await updateFirestoreData(DatabasePaths.Users, currentClient.id, updatedClientData);

      set(
        produce((state: BoundStore) => {
          state.client = { ...currentClient, ...updatedClientData };
        }),
      );
      successNotification('successUpdatedUser');
      navigate(`${Paths.clients}`);
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
