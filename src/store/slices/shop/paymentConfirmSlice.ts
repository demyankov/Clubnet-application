import { Timestamp, Unsubscribe, arrayUnion, increment } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabaseId } from 'constants/databaseId';
import { DatabasePaths } from 'constants/databasePaths';
import { purchaseAwaitingConfirm } from 'constants/purchaseAwaitingConfirm';
import { convertFiltersToArray, errorHandler, uniqueIdGenerator } from 'helpers';
import {
  Filter,
  deleteFirestoreData,
  getFilteredFirestoreData,
  setFirestoreData,
  subscribeToCollection,
  updateFirestoreData,
  getDocumentReference,
} from 'integrations/firebase';
import { IProductDataWithCount } from 'store/slices';
import { IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface IOrderConfirmation {
  id: string;
  product: IProductDataWithCount;
  userId: string;
}

interface IFilterProduct {
  userId: string;
  [key: string]: string;
}

interface IFilterUsers {
  purchaseAwaitingConfirm: purchaseAwaitingConfirm;
  [key: string]: string;
}

export interface IExpenseDescription {
  categoryId: string;
  countProduct: number;
  id: string;
  name: string;
  price: number;
}

export interface IPaymentConfirm {
  usersConfirm: IUser[];
  productConfirm: IOrderConfirmation[];
  isFetchingUsersAwaitConfirm: boolean;
  isFetchingConfirmProduct: boolean;
  currentOrderConfirmationId: string;
  usersConfirmTotalCount: number;
  getUsersAwaitConfirm: () => Unsubscribe;
  getConfirmProduct: (userId: string) => void;
  orderConfirmation: (
    balance: number,
    adminId: string,
    userId: string,
    expenseDescription: IExpenseDescription,
    orderConfirmation: string,
  ) => void;
  orderRevoke: (
    userId: string,
    balance: number,
    productId: string,
    countProduct: number,
    orderConfirmation: string,
  ) => void;
}

export const paymentConfirmSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  usersConfirm: [],
  productConfirm: [],
  isFetchingUsersAwaitConfirm: false,
  isFetchingConfirmProduct: false,
  currentOrderConfirmationId: '',
  usersConfirmTotalCount: 0,

  getUsersAwaitConfirm: () => {
    const dataFilter: IFilterUsers = {
      purchaseAwaitingConfirm: purchaseAwaitingConfirm.pending,
    };

    const usersAwaitConfirmFilter = convertFiltersToArray<Filter<IUser>, IFilterUsers>(
      dataFilter,
    );

    return subscribeToCollection<IUser>(
      DatabasePaths.Users,
      usersAwaitConfirmFilter,
      (data: IUser[]) => {
        set(
          produce((state: BoundStore) => {
            state.usersConfirm = data;
            state.usersConfirmTotalCount = data.length;
          }),
        );
      },
    );
  },

  getConfirmProduct: async (userId) => {
    set(
      produce((state: BoundStore) => {
        state.isFetchingConfirmProduct = true;
      }),
    );
    try {
      const dataFilter: IFilterProduct = {
        userId,
      };

      const productFilter = convertFiltersToArray<
        Filter<IOrderConfirmation>,
        IFilterProduct
      >(dataFilter);

      const { data } = await getFilteredFirestoreData<IOrderConfirmation>(
        DatabasePaths.OrderConfirmation,
        productFilter,
        'and',
        null,
        'userId',
      );

      set(
        produce((state: BoundStore) => {
          state.productConfirm = data;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFetchingConfirmProduct = false;
        }),
      );
    }
  },

  orderConfirmation: async (
    balance,
    adminId,
    userId,
    expenseDescription,
    orderConfirmationId,
  ) => {
    set(
      produce((state: BoundStore) => {
        state.currentOrderConfirmationId = orderConfirmationId;
      }),
    );
    try {
      const userLink = await getDocumentReference(DatabasePaths.Users, userId);
      const adminLink = await getDocumentReference(DatabasePaths.Users, adminId);

      const balanceId = uniqueIdGenerator(DatabaseId.BalanceHistory);
      const timestamp = Timestamp.fromDate(new Date());
      const history = {
        userLink,
        adminLink,
        expenseDescription,
        amount: balance,
        timestamp,
      };

      const docRef = await setFirestoreData(
        DatabasePaths.BalanceHistory,
        balanceId,
        history,
      );

      await updateFirestoreData(DatabasePaths.Users, userId, {
        balanceHistory: arrayUnion(docRef),
      });

      await deleteFirestoreData(DatabasePaths.OrderConfirmation, orderConfirmationId);

      if (get().productConfirm.length <= 1) {
        await updateFirestoreData(DatabasePaths.Users, userId, {
          purchaseAwaitingConfirm: purchaseAwaitingConfirm.fulfilled,
        });
        get().getUsersAwaitConfirm();
      }

      get().getConfirmProduct(userId);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.currentOrderConfirmationId = '';
        }),
      );
    }
  },

  orderRevoke: async (userId, balance, productId, countProduct, orderConfirmationId) => {
    set(
      produce((state: BoundStore) => {
        state.currentOrderConfirmationId = orderConfirmationId;
      }),
    );
    try {
      await updateFirestoreData(DatabasePaths.Users, userId, {
        balance: increment(balance),
      });

      await updateFirestoreData(DatabasePaths.Products, productId, {
        quantity: increment(countProduct),
      });

      await deleteFirestoreData(DatabasePaths.OrderConfirmation, orderConfirmationId);

      if (get().productConfirm.length <= 1) {
        await updateFirestoreData(DatabasePaths.Users, userId, {
          purchaseAwaitingConfirm: purchaseAwaitingConfirm.fulfilled,
        });
        get().getUsersAwaitConfirm();
      }

      get().getConfirmProduct(userId);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.currentOrderConfirmationId = '';
        }),
      );
    }
  },
});
