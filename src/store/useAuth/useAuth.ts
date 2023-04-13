import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  User,
} from 'firebase/auth';
import { create } from 'zustand';

type UserType = {
  isAuth: boolean;
  email: string | null;
  token: string | null;
  id: string | null;
};

type StoreType = {
  isFetching: boolean;
  isError: boolean;
  isUpdated: boolean;
  user: UserType;
  getUser: () => void;
  removeUser: () => void;
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => void;
  update: (password: string) => void;
};

const userInitialState: UserType = {
  isAuth: false,
  email: null,
  token: null,
  id: null,
};

export const useAuth = create<StoreType>((set) => ({
  isFetching: false,
  user: userInitialState,
  isError: false,
  isUpdated: false,

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

  login: async (email, password) => {
    set({ isFetching: true });
    set({ isError: false });
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
      set({ isError: true });
    } finally {
      set({ isFetching: false });
    }
  },
  register: async (email, password) => {
    set({ isFetching: true });
    set({ isError: false });
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
      set({ isError: true });
    } finally {
      set({ isFetching: false });
    }
  },

  update: async (password) => {
    set({ isFetching: true });
    set({ isError: false });
    const { currentUser } = getAuth();

    try {
      await updatePassword(currentUser as User, password);
      set({ isUpdated: true });
    } catch (error) {
      set({ isError: true });
    } finally {
      set({ isFetching: false });
    }
  },
}));
