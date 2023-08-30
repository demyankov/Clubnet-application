import { WhereFilterOp } from '@firebase/firestore';
import { QueryFieldFilterConstraint, where } from 'firebase/firestore';

import { Filter } from 'integrations/firebase';

export const generateQueryFilterArray = <T>(
  filters: Filter<T>[],
  filterOperator: WhereFilterOp,
): QueryFieldFilterConstraint[] => {
  return filters.map((filter) => {
    return where(filter.field as string, filterOperator, filter.value);
  });
};
