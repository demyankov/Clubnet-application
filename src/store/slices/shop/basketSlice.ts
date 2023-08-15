import { increment } from 'firebase/firestore';
import { produce } from 'immer';

import { DatabaseId } from 'constants/databaseId';
import { DatabasePaths } from 'constants/databasePaths';
import { purchaseAwaitingConfirm } from 'constants/purchaseAwaitingConfirm';
import {
  errorHandler,
  errorNotification,
  getCollectionPathUrl,
  successNotification,
  uniqueIdGenerator,
} from 'helpers';
import {
  deleteFirestoreData,
  getAllCollection,
  getFirestoreData,
  getFireStoreDataByFieldName,
  setFirestoreData,
  updateFirestoreData,
} from 'integrations/firebase';
import { IProductData } from 'store/slices/shop/shopSlice';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

interface IBasketData {
  id: string;
  countProduct: number;
}

export interface IProductDataWithCount extends IProductData {
  countProduct: number;
}

export interface IBasket {
  baskets: IProductDataWithCount[];
  basketTotalCounter: number;
  isFetchingBasket: boolean;
  isFetchingBasketAction: boolean;
  currentProductId: string;
  addInBasket: (data: IBasketData, userId: string, resetForm: () => void) => void;
  getBasketTotalCounter: (userId: string) => void;
  getBasket: (userId: string) => void;
  removeProductFromBasket: (userId: string, productId: string) => void;
  clearBasket: (userId: string) => void;
  buyProductFromBasket: (userId: string, userBalance: number, totalCost: number) => void;
  getProductsWithCountProduct: (
    userId: string,
  ) => Promise<Promise<IProductDataWithCount>[]>;
}

export const basketSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  baskets: [],
  basketTotalCounter: 0,
  isFetchingBasket: false,
  isFetchingBasketAction: false,
  currentProductId: '',

  addInBasket: async (data, userId, resetForm) => {
    set(
      produce((state: BoundStore) => {
        state.currentProductId = data.id;
      }),
    );
    try {
      const query = [DatabasePaths.Users, userId, DatabasePaths.Basket];
      const path = getCollectionPathUrl(query);

      const dataBasket = await getFireStoreDataByFieldName<IBasketData>(path, data.id);

      if (dataBasket) {
        await updateFirestoreData(path, data.id, {
          countProduct: increment(data.countProduct),
        });
        successNotification('addToBasket');
        resetForm();

        return;
      }
      await setFirestoreData<IBasketData>(path, data.id, data);

      successNotification('addToBasket');
      resetForm();
      get().getBasketTotalCounter(userId);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.currentProductId = '';
        }),
      );
    }
  },

  getBasketTotalCounter: async (userId) => {
    try {
      const query = [DatabasePaths.Users, userId, DatabasePaths.Basket];
      const path = getCollectionPathUrl(query);

      const { totalCount } = await getFirestoreData<IBasketData>(path);

      set(
        produce((state: BoundStore) => {
          state.basketTotalCounter = totalCount;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    }
  },

  getProductsWithCountProduct: async (userId) => {
    const query = [DatabasePaths.Users, userId, DatabasePaths.Basket];
    const path = getCollectionPathUrl(query);

    const data = await getAllCollection<IBasketData>(path);

    return data.map(async ({ id, countProduct }) => {
      const dataProduct = await getFireStoreDataByFieldName<IProductData>(
        DatabasePaths.Products,
        id,
      );

      return { ...dataProduct, countProduct } as IProductDataWithCount;
    });
  },

  getBasket: async (userId) => {
    set(
      produce((state: BoundStore) => {
        state.isFetchingBasket = true;
      }),
    );
    try {
      const productPromises = await get().getProductsWithCountProduct(userId);

      const dataBasket = await Promise.all(productPromises);

      set(
        produce((state: BoundStore) => {
          state.baskets = dataBasket;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFetchingBasket = false;
        }),
      );
    }
  },

  removeProductFromBasket: async (userId, productId) => {
    set(
      produce((state: BoundStore) => {
        state.isFetchingBasketAction = true;
      }),
    );
    try {
      const query = [DatabasePaths.Users, userId, DatabasePaths.Basket];
      const path = getCollectionPathUrl(query);

      await deleteFirestoreData(path, productId);
      get().getBasketTotalCounter(userId);
      get().getBasket(userId);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFetchingBasketAction = false;
        }),
      );
    }
  },

  clearBasket: async (userId) => {
    set(
      produce((state: BoundStore) => {
        state.isFetchingBasketAction = true;
      }),
    );
    try {
      const query = [DatabasePaths.Users, userId, DatabasePaths.Basket];
      const path = getCollectionPathUrl(query);

      const data = await getAllCollection<IBasketData>(path);

      const deletePromises = data.map(async ({ id }) => {
        await deleteFirestoreData(path, id);
      });

      await Promise.all(deletePromises);

      get().getBasketTotalCounter(userId);
      get().getBasket(userId);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFetchingBasketAction = false;
        }),
      );
    }
  },

  buyProductFromBasket: async (userId, userBalance, totalCost) => {
    set(
      produce((state: BoundStore) => {
        state.isFetchingBasketAction = true;
      }),
    );
    try {
      if (userBalance < totalCost) {
        errorNotification('insufficientBalance');

        return;
      }

      const productPromises = await get().getProductsWithCountProduct(userId);

      const dataBasket = await Promise.all(productPromises);

      const promises = dataBasket.map(async (product) => {
        if (product.quantity < product.countProduct) {
          errorNotification('productOutOfStock');

          return null;
        }
        await updateFirestoreData(DatabasePaths.Products, product.id, {
          quantity: increment(-product.countProduct),
        });

        await updateFirestoreData(DatabasePaths.Users, userId, {
          balance: increment(-(product.countProduct * product.price)),
        });

        const orderConfirmationId = uniqueIdGenerator(DatabaseId.OrderConfirmation);

        await setFirestoreData(DatabasePaths.OrderConfirmation, orderConfirmationId, {
          id: orderConfirmationId,
          product,
          userId,
        });
        get().removeProductFromBasket(userId, product.id);
      });

      const resolvedPromises = (await Promise.all(promises)).filter((el) => el !== null);

      if (!resolvedPromises.length) {
        return;
      }

      await updateFirestoreData(DatabasePaths.Users, userId, {
        purchaseAwaitingConfirm: purchaseAwaitingConfirm.pending,
      });

      successNotification('purchased');
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isFetchingBasketAction = false;
        }),
      );
    }
  },
});
