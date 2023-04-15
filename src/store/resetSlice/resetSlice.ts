import { getAuth, updatePassword, User } from 'firebase/auth';
import { StateCreator } from 'zustand';

export type ResetSlice = {
  isResetFetching: boolean;
  reset: (password: string) => Promise<boolean>;
};

export const resetSlice: StateCreator<ResetSlice, [], [], ResetSlice> = (set) => ({
  isResetFetching: false,

  reset: async (password) => {
    let isError = false;

    set({ isResetFetching: true });
    const { currentUser } = getAuth();

    try {
      await updatePassword(currentUser as User, password);

      return isError;
    } catch (error) {
      isError = true;

      return isError;
    } finally {
      set({ isResetFetching: false });
    }
  },
});
