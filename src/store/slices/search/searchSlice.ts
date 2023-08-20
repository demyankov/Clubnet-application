import { t } from 'i18next';
import { produce } from 'immer';

import { DatabasePaths } from 'constants/databasePaths';
import { errorHandler } from 'helpers';
import { Filter, getFirestoreDataBySubstring } from 'integrations/firebase';
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

      if (value) {
        const filter: Filter<IUser> = {
          field: 'nickName',
          value,
        };

        const users = await getFirestoreDataBySubstring<IUser>(
          DatabasePaths.Users,
          filter,
        );

        if (!users.length) {
          set(
            produce((state: BoundStore) => {
              state.resultText = t('search.empty');
            }),
          );
        }

        set(
          produce((state: BoundStore) => {
            state.searchResults = users;
          }),
        );
      }
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
