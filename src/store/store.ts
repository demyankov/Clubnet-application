import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  initSlice,
  getOTPSlice,
  signInSlice,
  signOutSlice,
  updateUserSlice,
  IState,
  IGetOTP,
  ISignIn,
  ISignOut,
  IUpdateUser,
} from 'store/slices';

export interface BoundStore extends IState, IGetOTP, ISignIn, ISignOut, IUpdateUser {}

export const useAuth = create(
  devtools(
    immer<BoundStore>((...a) => ({
      ...initSlice(...a),
      ...getOTPSlice(...a),
      ...signInSlice(...a),
      ...signOutSlice(...a),
      ...updateUserSlice(...a),
    })),
  ),
);
