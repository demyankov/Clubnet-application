import { getAuth, updatePassword, User } from 'firebase/auth';
import { StateCreator } from 'zustand';

export type ResetSlice = {
  isResetFetching: boolean;
  isResetError: boolean;
  isUpdated: boolean;
  reset: (password: string) => void;
};

export const resetSlice: StateCreator<ResetSlice, [], [], ResetSlice> = (set) => ({
  isResetFetching: false,
  isResetError: false,
  isUpdated: false,

  reset: async (password) => {
    set({ isResetFetching: true });
    set({ isResetError: false });
    const { currentUser } = getAuth();

    try {
      await updatePassword(currentUser as User, password);
      set({ isUpdated: true });
    } catch (error) {
      set({ isResetError: true });
    } finally {
      set({ isResetFetching: false });
    }
  },
});
