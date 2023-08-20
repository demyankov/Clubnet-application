import { IUser } from 'store/slices/auth/types';

export const getMembersIdList = (members: IUser[]): string[] =>
  members.map(({ id }) => id);
