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
  user: UserType;
  getUser: () => Promise<boolean>;
  removeUser: () => Promise<boolean>;
};

const userInitialState: UserType = {
  isAuth: false,
  email: null,
  token: null,
  id: null,
};

export const authSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  isFetching: false,
  user: userInitialState,

  getUser: async () => {
    set({ isFetching: true });
    const auth = getAuth();
    let isError = false;

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

      return isError;
    } catch (error) {
      isError = true;

      return isError;
    } finally {
      set({ isFetching: false });
    }
  },

  removeUser: async () => {
    set({ isFetching: true });
    const auth = getAuth();
    let isError = false;

    try {
      await signOut(auth);
      set({ user: userInitialState });

      return isError;
    } catch (error) {
      isError = true;

      return isError;
    } finally {
      set({ isFetching: false });
    }
  },
});
