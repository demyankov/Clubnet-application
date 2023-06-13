import uniqid from 'uniqid';

import { DatabaseId } from 'constants/databaseId';

export const uniqueIdGenerator = (path: DatabaseId): string => uniqid(`${path}-`);
