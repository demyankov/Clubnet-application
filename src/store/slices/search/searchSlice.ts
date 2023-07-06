import { t } from 'i18next';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler } from 'helpers';
import { Filter, getFirestoreData } from 'integrations/firebase';
import { IUser } from 'store/slices/auth/types';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';

export interface ISearch {
  isSearching: boolean;
  handleSearch: (value?: string) => void;
  dropdownToggle: (isOpen: boolean) => void;
  isDropdownOpen: boolean;
  searchResults: IUser[];
  resultText: string;
}

export const searchSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  isSearching: false,
  searchResults: [],
  resultText: '',
  isDropdownOpen: false,

  handleSearch: async (value) => {
    try {
      set(
        produce((state: BoundStore) => {
          state.isSearching = true;
        }),
      );

      const filters: Filter<string>[] = [];

      if (value) {
        filters.push({
          field: 'nickName',
          value,
        });
      }

      const { data } = await getFirestoreData<IUser, string>(
        DatabasePaths.Users,
        filters,
      );

      if (!data.length) {
        set(
          produce((state: BoundStore) => {
            state.resultText = t('search.empty');
          }),
        );
      }

      set(
        produce((state: BoundStore) => {
          state.searchResults = data;
        }),
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      set(
        produce((state: BoundStore) => {
          state.isSearching = false;
        }),
      );
    }
  },

  dropdownToggle: (isOpen) => {
    set(
      produce((state: BoundStore) => {
        state.isDropdownOpen = isOpen;
        state.resultText = '';
        state.searchResults = [];
      }),
    );
  },
});
