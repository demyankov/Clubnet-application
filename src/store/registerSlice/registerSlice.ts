import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { StateCreator } from 'zustand';

import { AuthSlice } from 'store/authSlice/authSlice';

export type RegisterSlice = {
  isRegFetching: boolean;
  register: (email: string, password: string) => Promise<boolean>;
};

export const registerSlice: StateCreator<
  RegisterSlice & AuthSlice,
  [],
  [],
  RegisterSlice
> = (set) => ({
  isRegFetching: false,

  register: async (email, password) => {
    set({ isRegFetching: true });
    let isError = false;
    const auth = getAuth();

    try {
      const userData = await createUserWithEmailAndPassword(auth, email, password);

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
      set({ isRegFetching: false });
    }
  },
});
