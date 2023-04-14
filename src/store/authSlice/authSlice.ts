import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { StateCreator } from 'zustand';

type UserType = {
  isAuth: boolean;
  email: string | null;
  token: string | null;
  id: string | null;
};

export type AuthSlice = {
  isFetching: boolean;
  isError: boolean;
  user: UserType;
  getUser: () => void;
  removeUser: () => void;
};

const userInitialState: UserType = {
  isAuth: false,
  email: null,
  token: null,
  id: null,
};

export const authSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  isFetching: false,
  isError: false,
  user: userInitialState,

  getUser: async () => {
    set({ isFetching: true });
    set({ isError: false });
    const auth = getAuth();

    try {
      onAuthStateChanged(auth, async (userData) => {
        if (userData) {
          set({
            user: {
              isAuth: true,
              email: userData.email,
              token: await userData.getIdToken(),
              id: userData.uid,
            },
          });
        } else {
          set({
            user: userInitialState,
          });
        }
      });
    } catch (error) {
      set({ isError: true });
    } finally {
      set({ isFetching: false });
    }
  },

  removeUser: async () => {
    set({ isFetching: true });
    set({ isError: false });
    const auth = getAuth();

    try {
      await signOut(auth);
      set({ user: userInitialState });
    } catch (error) {
      set({ isError: true });
    } finally {
      set({ isFetching: false });
    }
  },
});
