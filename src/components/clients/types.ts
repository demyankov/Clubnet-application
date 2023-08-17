export interface IUpdateBalanceFormValues {
  addBalance: string;
  subtractBalance: string;
}

export interface IClientsModalFormValues {
  name: string;
  phone: string;
}
export interface ITable {
  field: 'name' | 'role' | 'nickName' | 'phone' | 'balance';
  label:
    | 'common.fullName'
    | 'common.role'
    | 'common.nickname'
    | 'common.phone'
    | 'common.balance';
}
