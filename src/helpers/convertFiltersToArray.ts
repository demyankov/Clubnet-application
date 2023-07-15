import { formatPhoneNumber } from 'helpers/formatters';

export const convertFiltersToArray = <R, T extends { [x: string]: string }>(
  filter?: T,
): R[] => {
  if (!filter) {
    return [];
  }

  return Object.keys(filter)
    .map((key) =>
      key === 'phone'
        ? { field: key, value: formatPhoneNumber(filter[key]) }
        : { field: key, value: filter[key] },
    )
    .filter((filter) => filter.value.length > 0) as R[];
};
