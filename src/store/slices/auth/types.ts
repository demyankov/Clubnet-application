import { DocumentReference } from 'firebase/firestore';

import { Roles } from 'constants/userRoles';

export interface IUser {
  id: string;
  phone: Nullable<string>;
  nickName: Nullable<string>;
  name: Nullable<string>;
  image: Nullable<string>;
  balance?: number;
  balanceHistory: DocumentReference[];
  role: Roles;
}

export interface IAddUser {
  phone: string;
  name: string;
}

export type EditableUserFields = Pick<IUser, 'name' | 'image' | 'role'>;
