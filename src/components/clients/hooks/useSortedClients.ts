import { useMemo } from 'react';

import { SortData } from 'constants/sortData';
import { IUser } from 'store/slices/auth/types';

export type ISortFields = 'name' | 'role' | 'nickName' | 'phone' | 'balance';

export const useSortedClients = (
  clients: IUser[],
  sort: { field: ISortFields; direction: SortData },
): IUser[] => {
  return useMemo(() => {
    const sortedData = [...clients];

    sortedData.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (sort.field === 'balance') {
        const aValueNumber = parseInt(String(aValue || '0'), 10);
        const bValueNumber = parseInt(String(bValue || '0'), 10);

        return (
          (aValueNumber - bValueNumber) * (sort.direction === SortData.Increase ? 1 : -1)
        );
      }

      const aValueString = (aValue ?? '').toString();
      const bValueString = (bValue ?? '').toString();

      return (
        aValueString.localeCompare(bValueString) *
        (sort.direction === SortData.Increase ? 1 : -1)
      );
    });

    return sortedData;
  }, [clients, sort]);
};
