import { notifications } from '@mantine/notifications';

import { generateRecaptcha, appGetOTP } from 'integrations/firebase/phoneAuth';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IError } from 'store/types';
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
      set((state) => ({
        ...state,
        getOTP: {
          ...state.getOTP,
          isFetching: true,
        },
      }));
      try {
        await appGetOTP(phone);
      } catch (error) {
        set((state) => ({
          ...state,
          getOTP: {
            ...state.getOTP,
            isFetching: false,
            error: (error as IError).message,
          },
        }));
        notifications.show({
          title: t('notifications.error-header'),
          message: t('notifications.phone-error'),
          color: 'red',
        });
      }

      set((state) => ({
        ...state,
        getOTP: {
          ...state.getOTP,
          isFetching: false,
        },
      }));
    },
  },
});
