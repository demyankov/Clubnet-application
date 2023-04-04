import { configureStore } from '@reduxjs/toolkit';

import userReducer from 'store/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootStateType = ReturnType<typeof store.getState>;
