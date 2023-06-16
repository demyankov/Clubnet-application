import { StateCreator } from 'zustand';

import { Roles } from 'constants/userRoles';

export type GenericStateCreator<T> = StateCreator<T, [], [], T>;

export interface IUser {
  id: string;
  phone: Nullable<string>;
  nickName: string;
  name: Nullable<string>;
  image: Nullable<string>;
  role: Roles;
}

export type EditableUserFields = Pick<IUser, 'name' | 'image' | 'role'>;
