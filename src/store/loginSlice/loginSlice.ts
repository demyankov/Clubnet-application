import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { StateCreator } from 'zustand';

import { AuthSlice } from 'store/authSlice/authSlice';

export type LoginSlice = {
  isLoginFetching: boolean;
  login: (email: string, password: string) => Promise<boolean>;
};

export const loginSlice: StateCreator<LoginSlice & AuthSlice, [], [], LoginSlice> = (
  set,
) => ({
  isLoginFetching: false,

  login: async (email, password) => {
    set({ isLoginFetching: true });
    let isError = false;
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

      return isError;
    } catch (error) {
      isError = true;

      return isError;
    } finally {
      set({ isLoginFetching: false });
    }
  },
});
