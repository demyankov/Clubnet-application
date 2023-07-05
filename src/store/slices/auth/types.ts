import { Roles } from 'constants/userRoles';

export interface IUser {
  id: string;
  phone: Nullable<string>;
  nickName: Nullable<string>;
  name: Nullable<string>;
  image: Nullable<string>;
  role: Roles;
}

export type EditableUserFields = Pick<IUser, 'name' | 'image' | 'role'>;