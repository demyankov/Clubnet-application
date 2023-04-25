import { generateRecaptcha, appGetOTP } from 'integrations/firebase/phoneAuth';
import { BoundStore } from 'store/store';
import { GenericStateCreator, IError } from 'store/types';

export interface IGetOTP {
  getOTP: {
    isFetching: boolean;
    error: Nullable<string>;

    sendOTP: (phone: string) => Promise<void>;
  };
}

export const getOTPSlice: GenericStateCreator<BoundStore> = (set, get) => ({
  ...get(),
  getOTP: {
    isFetching: false,
    error: null,

    sendOTP: async (phone) => {
      generateRecaptcha();
      try {
        set((state) => ({
          ...state,
          getOTP: {
            ...state.getOTP,
            isFetching: true,
          },
        }));

        await appGetOTP(phone);

        set((state) => ({
          ...state,
          getOTP: {
            ...state.getOTP,
            isFetching: false,
          },
        }));
      } catch (error) {
        set((state) => ({
          ...state,
          getOTP: {
            ...state.getOTP,
            isFetching: false,
            error: (error as IError).message,
          },
        }));
      }
    },
  },
});
