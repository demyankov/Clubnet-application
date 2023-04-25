import { create } from 'zustand';

import {
  initSlice,
  getOTPSlice,
  signInSlice,
  signOutSlice,
  IState,
  IGetOTP,
  ISignIn,
  ISignOut,
} from 'store/slices';

export interface BoundStore extends IState, IGetOTP, ISignIn, ISignOut {}

export const useAuth = create<BoundStore>()((...a) => ({
  ...initSlice(...a),
  ...getOTPSlice(...a),
  ...signInSlice(...a),
  ...signOutSlice(...a),
}));
