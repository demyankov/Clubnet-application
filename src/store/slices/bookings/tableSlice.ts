import { produce } from 'immer';

import { DatabaseId } from 'constants/databaseId';
import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler, uniqueIdGenerator } from 'helpers';
import {
  deleteFirestoreData,
  Filter,
  getFirestoreData,
  getFireStoreDataByFieldName,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { IAddress, IOrder, ITable } from 'store/slices/bookings/types';
import { BookingStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface ITableActions {
  tableActions: {
    isTableFetching: boolean;
    tables: ITable[];
    currentTable: Nullable<ITable>;

    setCurrentTable: (table?: ITable) => Promise<void>;
    addTable: () => Promise<void>;
    deleteTable: (close: () => void) => Promise<void>;
  };
}

export const tableSlice: GenericStateCreator<BookingStore> = (set, get) => ({
  ...get(),
  tableActions: {
    isTableFetching: false,
    tables: [],
    currentTable: null,

    setCurrentTable: async (table) => {
      if (!table) {
        set(
          produce((state: BookingStore) => {
            state.tableActions.currentTable = null;
            state.orderActions.orders = [];
          }),
        );

        return;
      }

      try {
        set(
          produce((state: BookingStore) => {
            state.tableActions.isTableFetching = true;
          }),
        );

        set(
          produce((state: BookingStore) => {
            state.tableActions.currentTable = table;
          }),
        );
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BookingStore) => {
            state.tableActions.isTableFetching = false;
          }),
        );
      }
    },

    addTable: async () => {
      set(
        produce((state: BookingStore) => {
          state.tableActions.isTableFetching = true;
        }),
      );

      const {
        addressActions: { currentAddress },
      } = get();
      const id = uniqueIdGenerator(DatabaseId.Tables);
      const {
        tableActions: { tables },
      } = get();

      if (currentAddress) {
        // TODO: refactor name generation
        const name = tables.length
          ? tables[tables.length - 1].name + 1
          : tables.length + 1;
        const table: ITable = { id, name, ordersCount: 0 };

        try {
          const tableRef = await setFirestoreData<ITable>(
            DatabasePaths.Tables,
            id,
            table,
          );
          const updatedArray = [...currentAddress.tables, tableRef];

          await updateFirestoreData(DatabasePaths.Addresses, currentAddress.id, {
            tables: updatedArray,
          });

          set(
            produce((state: BookingStore) => {
              state.addressActions.currentAddress!.tables = updatedArray;
              state.tableActions.tables = [...state.tableActions.tables, table];
            }),
          );
        } catch (error) {
          errorHandler(error as Error);
        } finally {
          set(
            produce((state: BookingStore) => {
              state.tableActions.isTableFetching = false;
            }),
          );
        }
      }
    },

    deleteTable: async (close) => {
      const {
        addressActions: { currentAddress },
        tableActions: { currentTable },
      } = get();

      if (currentAddress && currentTable) {
        set(
          produce((state: BookingStore) => {
            state.tableActions.isTableFetching = true;
          }),
        );

        try {
          await deleteFirestoreData(DatabasePaths.Tables, currentTable.id);
          const arrayToUpdate = currentAddress.tables.filter(
            (table) => table.id !== currentTable.id,
          );

          await updateFirestoreData(DatabasePaths.Addresses, currentAddress.id, {
            tables: arrayToUpdate,
          });
          const updatedAddress = await getFireStoreDataByFieldName<IAddress>(
            DatabasePaths.Addresses,
            currentAddress.id,
          );

          if (updatedAddress) {
            set(
              produce((state: BookingStore) => {
                state.addressActions.currentAddress = updatedAddress;
                state.tableActions.tables = state.tableActions.tables.filter(
                  (table) => table.id !== currentTable.id,
                );
              }),
            );
          }

          if (currentTable.ordersCount) {
            const filter: Filter<IOrder> = {
              field: 'tableId',
              value: currentTable.id,
            };
            const { data } = await getFirestoreData<IOrder>(DatabasePaths.Orders, [
              filter,
            ]);

            data.forEach(async (order) => {
              await deleteFirestoreData(DatabasePaths.Orders, order.id);
            });
          }

          set(
            produce((state: BookingStore) => {
              state.tableActions.currentTable = null;
              state.orderActions.orders = [];
            }),
          );

          close();
        } catch (error) {
          errorHandler(error as Error);
        } finally {
          set(
            produce((state: BookingStore) => {
              state.tableActions.isTableFetching = false;
            }),
          );
        }
      }
    },
  },
});
