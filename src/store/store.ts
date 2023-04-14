import { create } from 'zustand';

import { authSlice, AuthSlice } from 'store/authSlice/authSlice';
import { loginSlice, LoginSlice } from 'store/loginSlice/loginSlice';
import { registerSlice, RegisterSlice } from 'store/registerSlice/registerSlice';
import { resetSlice, ResetSlice } from 'store/resetSlice/resetSlice';

export const useStore = create<AuthSlice & LoginSlice & RegisterSlice & ResetSlice>()(
  (...a) => ({
    ...authSlice(...a),
    ...loginSlice(...a),
    ...registerSlice(...a),
    ...resetSlice(...a),
  }),
);
