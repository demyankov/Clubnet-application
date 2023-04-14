import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { StateCreator } from 'zustand';

import { AuthSlice } from 'store/authSlice/authSlice';

export type RegisterSlice = {
  isRegFetching: boolean;
  isRegError: boolean;

  register: (email: string, password: string) => void;
};

export const registerSlice: StateCreator<
  RegisterSlice & AuthSlice,
  [],
  [],
  RegisterSlice
> = (set) => ({
  isRegFetching: false,
  isRegError: false,

  register: async (email, password) => {
    set({ isRegFetching: true });
    set({ isRegError: false });
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
    } catch (error) {
      set({ isRegError: true });
    } finally {
      set({ isRegFetching: false });
    }
  },
});
