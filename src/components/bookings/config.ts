import { FC } from 'react';

import { BookingsAddAddressStep, BookingsAddWorkingHoursStep } from 'components';
import { AddAddressSteps, AddressStepsProps } from 'components/bookings/types';

export const ADD_ADDRESS_STEPS: Record<AddAddressSteps, FC<AddressStepsProps>> = {
  [AddAddressSteps.Address]: BookingsAddAddressStep,
  [AddAddressSteps.WorkingHours]: BookingsAddWorkingHoursStep,
};
