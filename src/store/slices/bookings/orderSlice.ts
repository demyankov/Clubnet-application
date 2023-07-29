import dayjs from 'dayjs';
import { DocumentReference } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabaseId } from 'constants/databaseId';
import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler } from 'helpers';
import { uniqueIdGenerator } from 'helpers/uniqueIdGenerator';
import {
  Filter,
  getFirestoreData,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { IOrder } from 'store/slices/bookings/types';
import { BookingStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface IOrderActions {
  orderActions: {
    isOrderFetching: boolean;
    orders: IOrder[];

    getOrders: (id: string, date: string) => Promise<void>;
    addOrder: (
      data: Omit<IOrder, 'id'>,
      reset: () => void,
      openModalSuccess: () => void,
    ) => Promise<void>;
    resetOrders: () => void;
  };
}

export const orderSlice: GenericStateCreator<BookingStore> = (set, get) => ({
  ...get(),
  orderActions: {
    isOrderFetching: false,
    orders: [],

    getOrders: async (id, date) => {
      try {
        set(
          produce((state: BookingStore) => {
            state.orderActions.isOrderFetching = true;
          }),
        );

        const filter: Filter<IOrder> = {
          field: 'date',
          value: date,
        };

        const { data } = await getFirestoreData<IOrder>(
          DatabasePaths.Orders,
          [filter],
          null,
          undefined,
          'start',
        );

        const field = id.split('-')[0]; // 'table' or 'address'
        // @ts-ignore
        const orders = data.filter((order) => order[`${field}Id`] === id);

        set(
          produce((state: BookingStore) => {
            state.orderActions.orders = orders;
          }),
        );
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BookingStore) => {
            state.orderActions.isOrderFetching = false;
          }),
        );
      }
    },

    addOrder: async (data, reset, openModalSuccess) => {
      try {
        set(
          produce((state: BookingStore) => {
            state.orderActions.isOrderFetching = true;
          }),
        );

        const {
          tableActions: { currentTable },
          orderActions: { orders },
        } = get();

        const id = uniqueIdGenerator(DatabaseId.Orders);
        const order = { ...data, id };
        const orderRef = await setFirestoreData<IOrder>(DatabasePaths.Orders, id, order);
        const newOrderValue = dayjs(order.start.toDate());
        let updatedOrders: IOrder[];
        let updatedOrderRefs: DocumentReference<IOrder>[];

        if (orders.length) {
          let indexToInsert = 0;

          orders.forEach((order, index) => {
            const orderValue = dayjs(order.start.toDate());

            if (newOrderValue.isAfter(orderValue)) {
              indexToInsert = index + 1;
            }
          });

          updatedOrders = [...orders];
          updatedOrders.splice(indexToInsert, 0, order);
        } else {
          updatedOrders = [order];
          updatedOrderRefs = [orderRef];
        }

        const updatedOrdersCount = currentTable!.ordersCount + 1;

        await updateFirestoreData(DatabasePaths.Tables, currentTable!.id, {
          ordersCount: updatedOrdersCount,
        });

        set(
          produce((state: BookingStore) => {
            state.tableActions.currentTable = {
              ...currentTable!,
              ordersCount: updatedOrdersCount,
            };
            state.orderActions.orders = updatedOrders;
            state.tableActions.tables = state.tableActions.tables.map((table) => {
              if (table.id === currentTable!.id) {
                return {
                  ...table,
                  orders: updatedOrderRefs,
                  ordersCount: updatedOrdersCount,
                };
              }

              return table;
            });
          }),
        );
        reset();
        openModalSuccess();
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        set(
          produce((state: BookingStore) => {
            state.orderActions.isOrderFetching = false;
          }),
        );
      }
    },

    resetOrders: () => {
      set(
        produce((state: BookingStore) => {
          state.orderActions.orders = [];
        }),
      );
    },
  },
});
