import { where, QueryFieldFilterConstraint } from 'firebase/firestore';

import { Filter } from 'integrations/firebase';

export const generateQueryFilterArray = <T>(
  filters: Filter<T>[],
): QueryFieldFilterConstraint[] => {
  return filters.map((filter) => {
    return where(filter.field as string, '==', filter.value);
  });
};
