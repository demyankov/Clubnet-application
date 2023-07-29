import { Dispatch, SetStateAction } from 'react';

import { IAddress, IEstablishment } from 'store/slices/bookings/types';

export enum AddAddressSteps {
  Address,
  WorkingHours,
}

export type IFormValues = Pick<IAddress, 'city' | 'address' | 'phone'> &
  Pick<IEstablishment, 'name'>;

export type AddressStepsProps = {
  formValues: IFormValues;
  setFormValues: Dispatch<SetStateAction<IFormValues>>;
  setCurrentStep: Dispatch<SetStateAction<AddAddressSteps>>;
  handleOnClose: () => void;
};

export interface IHourValue {
  value: string;
  label: string;
  disabled: boolean;
}
