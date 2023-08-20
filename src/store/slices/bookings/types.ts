import { DocumentReference, Timestamp } from 'firebase/firestore';

import { IUser } from 'store/slices/auth/types';

export interface IEstablishment {
  id: string;
  name: string;
  addresses: DocumentReference<IAddress>[];
}

export interface IAddress {
  id: string;
  city: string;
  address: string;
  phone: string;
  workingHours: IWorkingHours;
  tables: DocumentReference<ITable>[];
}

export enum WeekDays {
  Mon = 'Mon',
  Tue = 'Tue',
  Wed = 'Wed',
  Thu = 'Thu',
  Fri = 'Fri',
  Sat = 'Sat',
  Sun = 'Sun',
}

interface IDayHours {
  isAvailable: boolean;
  start: string;
  finish: string;
}

export type IWorkingHours = Record<WeekDays, IDayHours>;

export interface ITable {
  id: string;
  name: number;
  bookingsCount: number;
}

interface IContact {
  name: string;
  phone: string;
}

export interface IBooking {
  id: string;
  tableId: string;
  addressId: string;
  date: string;
  start: Timestamp;
  finish: Timestamp;
  contact: IContact;
  owner: Nullable<DocumentReference<IUser>>;
}

export type AddressData = Omit<IAddress, 'id' | 'tables'>;
