import { modals } from '@mantine/modals';
import { arrayUnion, doc, increment, Timestamp } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabaseId } from 'constants/databaseId';
import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler, successNotification, uniqueIdGenerator } from 'helpers';
import {
  getDataArrayWithRefArray,
  getFireStoreDataByFieldName,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { db } from 'integrations/firebase/firebase';
import { IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface IBalanceHistory {
  isBalanceFetching: boolean;
  balanceId: string;
  history: IHistory[];
  updateBalance: (data: IBalanceData, resetForm: () => void) => void;
  getBalanceHistory: (userId: string) => void;
}

export interface IBalanceData {
  balance: number;
  userId: string;
  adminId: string;
}

export interface IHistory {
  adminId: string;
  amount: string;
  timestamp: Timestamp;
  userId: string;
}

export const balanceHistorySlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isBalanceFetching: false,
  balanceId: '',
  history: [],

  updateBalance: async ({ balance, adminId, userId }, resetForm) => {
    set(
      produce((state: BoundStore) => {
        state.isBalanceFetching = true;
      }),
    );
    try {
      const userRef = doc(db, DatabasePaths.Users, userId);
      const adminRef = doc(db, DatabasePaths.Users, adminId);

      await updateFirestoreData(DatabasePaths.Users, userId, {
        balance: increment(balance),
      });

      const balanceId = uniqueIdGenerator(DatabaseId.BalanceHistory);
      const timestamp = Timestamp.fromDate(new Date());
      const history = {
        userLink: userRef,
        adminLink: adminRef,
        amount: balance > 0 ? `+${balance}` : balance,
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

      set(
        produce((state: BoundStore) => {
          state.balanceId = balanceId;
        }),
      );

      modals.close('updateBalanceModal');

      if (balance > 0) {
        successNotification('successfullyAddBalance');

        return;
      }
      successNotification('successfullyDebitBalance');
      resetForm();
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isBalanceFetching = false;
        }),
      );
    }
  },

  getBalanceHistory: async (userId: string) => {
    set(
      produce((state: BoundStore) => {
        state.isBalanceFetching = true;
      }),
    );

    try {
      const updatedEstablishment = await getFireStoreDataByFieldName<IUser>(
        DatabasePaths.Users,
        userId,
      );

      if (updatedEstablishment?.balanceHistory.length) {
        const history = await getDataArrayWithRefArray(
          updatedEstablishment.balanceHistory,
        );

        set(
          produce((state: BoundStore) => {
            state.history = history as IHistory[];
          }),
        );
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isBalanceFetching = false;
        }),
      );
    }
  },
});
