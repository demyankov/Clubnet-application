import { modals } from '@mantine/modals';
import { produce } from 'immer';

import { DatabaseId } from 'constants/databaseId';
import { DatabasePaths } from 'constants/databasePaths';
import { StorageFolders } from 'constants/storageFolders';
import {
  convertFiltersToArray,
  errorHandler,
  successNotification,
  uniqueIdGenerator,
} from 'helpers';
import {
  Filter,
  getAllCollection,
  getFilteredFirestoreData,
  setFirestoreData,
  uploadImageAndGetURL,
} from 'integrations/firebase';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

interface ICategoryData {
  id: string;
  name: string;
}

export interface IFilterProduct {
  categoryId: string;
  [key: string]: string;
}

interface IAddProduct {
  name: string;
  quantity: number;
  price: number;
  image: Nullable<File>;
}

export interface IProductData extends Omit<IAddProduct, 'image'> {
  id: string;
  image: Nullable<string>;
  categoryId: string;
}

export interface IShop {
  totalCountProduct: number;
  categories: ICategoryData[];
  defaultCategory: string;
  categoryId: string;
  products: IProductData[];
  isCategoriesFetching: boolean;
  isProductsFetching: boolean;
  isAddCategoriesFetching: boolean;
  isAddProductsFetching: boolean;
  isGetMoreProductsFetching: boolean;
  addCategory: (name: string, resetForm: () => void) => void;
  addProduct: (data: IAddProduct, categoryId: string, resetForm: () => void) => void;
  getCategories: () => void;
  getProductsByCategoryId: (categoryId: string, categoryName: string) => void;
  getMoreProductsByCategoryId: () => void;
}

export const shopSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  categories: [],
  defaultCategory: '',
  categoryId: '',
  products: [],
  isCategoriesFetching: false,
  isProductsFetching: false,
  isGetMoreProductsFetching: false,
  isAddCategoriesFetching: false,
  isAddProductsFetching: false,
  totalCountProduct: 0,

  addCategory: async (name, resetForm) => {
    set(
      produce((state: BoundStore) => {
        state.isAddCategoriesFetching = true;
      }),
    );
    try {
      const id = uniqueIdGenerator(DatabaseId.Categories);

      await setFirestoreData<ICategoryData>(DatabasePaths.Categories, id, {
        id,
        name,
      });

      modals.close('addCategoryModal');
      resetForm();

      get().getCategories();

      successNotification('addCategoryNotification');
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isAddCategoriesFetching = false;
        }),
      );
    }
  },

  addProduct: async ({ name, image, price, quantity }, categoryId, resetForm) => {
    set(
      produce((state: BoundStore) => {
        state.isAddProductsFetching = true;
      }),
    );
    try {
      let imageURL: Nullable<string> = null;

      const id = uniqueIdGenerator(DatabaseId.Products);

      if (image) {
        imageURL = await uploadImageAndGetURL(
          image,
          StorageFolders.Images.ProductImage,
          id,
        );
      }

      await setFirestoreData<IProductData>(DatabasePaths.Products, id, {
        id,
        name,
        quantity,
        price,
        image: imageURL,
        categoryId,
      });

      modals.close('addProductModal');
      resetForm();

      get().getCategories();

      successNotification('addProductNotification');
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isAddProductsFetching = false;
        }),
      );
    }
  },

  getCategories: async () => {
    set(
      produce((state: BoundStore) => {
        state.isCategoriesFetching = true;
      }),
    );
    try {
      const data = await getAllCollection<ICategoryData>(DatabasePaths.Categories);

      get().getProductsByCategoryId(data[0].id, data[0].name);
      set(
        produce((state: BoundStore) => {
          state.categories = data;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isCategoriesFetching = false;
        }),
      );
    }
  },

  getProductsByCategoryId: async (categoryId, categoryName) => {
    set(
      produce((state: BoundStore) => {
        state.isProductsFetching = true;
      }),
    );
    try {
      const dataFilter: IFilterProduct = {
        categoryId,
      };

      const productFilter = convertFiltersToArray<Filter<IProductData>, IFilterProduct>(
        dataFilter,
      );

      const { data, querySnapshot, totalCount } =
        await getFilteredFirestoreData<IProductData>(
          DatabasePaths.Products,
          productFilter,
        );

      set(
        produce((state: BoundStore) => {
          state.products = data;
          state.querySnapshot = querySnapshot;
          state.totalCountProduct = totalCount;
          state.defaultCategory = categoryName;
          state.categoryId = categoryId;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isProductsFetching = false;
        }),
      );
    }
  },

  getMoreProductsByCategoryId: async () => {
    set(
      produce((state: BoundStore) => {
        state.isGetMoreProductsFetching = true;
      }),
    );
    try {
      const lastVisible = get().querySnapshot?.docs[get().querySnapshot!.docs.length - 1];

      const filter: Filter<IProductData> = {
        field: 'categoryId',
        value: get().categoryId,
      };

      const { data, querySnapshot } = await getFilteredFirestoreData<IProductData>(
        DatabasePaths.Products,
        [filter],
        'and',
        lastVisible,
      );

      set(
        produce((state: BoundStore) => {
          state.products = [...state.products, ...data];
          state.querySnapshot = querySnapshot;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isGetMoreProductsFetching = false;
        }),
      );
    }
  },
});
