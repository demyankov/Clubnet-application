export const isValueIncludedInObjectsArray = <T, V extends keyof T>(
  array: T[],
  key: V,
  value: any,
): boolean => array.some((object) => object[key] === value);
