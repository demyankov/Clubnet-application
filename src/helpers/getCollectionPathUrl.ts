import { DatabasePaths } from 'constants/databasePaths';

export const getCollectionPathUrl = (collections: string[]): DatabasePaths =>
  collections.join('/') as DatabasePaths;
