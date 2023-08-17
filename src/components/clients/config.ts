import { ITable } from 'components/clients/types';
import { Roles } from 'constants/userRoles';

export const ROLES_DATA = Object.values(Roles);

export const MAX_BALANCE = 500000;

export const TABLE_HEADERS: ITable[] = [
  { field: 'name', label: 'common.fullName' },
  { field: 'role', label: 'common.role' },
  { field: 'nickName', label: 'common.nickname' },
  { field: 'phone', label: 'common.phone' },
  { field: 'balance', label: 'common.balance' },
];
