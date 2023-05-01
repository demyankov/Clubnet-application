import { StateCreator } from 'zustand';

import { Roles } from '../constants/userRoles';

export type GenericStateCreator<T> = StateCreator<T, [], [], T>;

export interface IError {
  code: string;
  message: string;
  name: string;
}

export interface IUser {
  id: string;
  phone: Nullable<string>;
  name: Nullable<string>;
  image: Nullable<string>;
  role: Roles;
}
