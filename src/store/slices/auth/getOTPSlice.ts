import { produce } from 'immer';

import { errorNotification } from 'helpers';
import { generateRecaptcha, appGetOTP } from 'integrations/firebase/auth';
import { BoundStore } from 'store/store';
import { GenericStateCreator } from 'store/types';
import { TF } from 'types/translation';

export interface IGetOTP {
  getOTP: {
    isFetching: boolean;
    error: Nullable<string>;
    sendOTP: (phone: string, t: TF) => Promise<void>;
  };
}

export const getOTPSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  getOTP: {
    isFetching: false,
    error: null,

    sendOTP: async (phone, t: TF) => {
      generateRecaptcha();
      set(
        produce((state: BoundStore) => {
          state.getOTP.isFetching = true;
        }),
      );
      try {
        await appGetOTP(phone);
      } catch (error) {
        errorNotification(t, 'errorPhone');
      } finally {
        set(
          produce((state: BoundStore) => {
            state.getOTP.isFetching = false;
          }),
        );
      }
    },
  },
});
