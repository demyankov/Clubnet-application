import { formatPhoneNumber } from 'helpers';

export const convertFiltersToArray = <F, T extends { [x: string]: T[keyof T] }>(
  filter?: T,
): F[] => {
  if (!filter) {
    return [];
  }

  return Object.keys(filter)
    .map((key) =>
      key === 'phone'
        ? { field: key, value: formatPhoneNumber(filter[key] as string) }
        : { field: key, value: filter[key] },
    )
    .filter((filter) => (filter.value as string).length > 0) as F[];
};
