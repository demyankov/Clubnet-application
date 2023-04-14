import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { StateCreator } from 'zustand';

import { AuthSlice } from 'store/authSlice/authSlice';

export type LoginSlice = {
  isLoginFetching: boolean;
  isLoginError: boolean;
  login: (email: string, password: string) => void;
};

export const loginSlice: StateCreator<LoginSlice & AuthSlice, [], [], LoginSlice> = (
  set,
) => ({
  isLoginFetching: false,
  isLoginError: false,

  login: async (email, password) => {
    set({ isLoginFetching: true });
    set({ isLoginError: false });
    const auth = getAuth();

    try {
      const userData = await signInWithEmailAndPassword(auth, email, password);

      set({
        user: {
          isAuth: true,
          email: userData.user.email,
          token: await userData.user.getIdToken(),
          id: userData.user.uid,
        },
      });
    } catch (error) {
      set({ isLoginError: true });
    } finally {
      set({ isLoginFetching: false });
    }
  },
});
