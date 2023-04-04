import { createSlice } from '@reduxjs/toolkit';

export type UserStateType = {
  email: string | null;
  token: string | null;
  id: string | null;
};

export type ActionType = {
  type: string;
  payload: UserStateType;
};

const initialState: UserStateType = {
  email: null,
  token: null,
  id: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: ActionType) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    removeUser(state) {
      state.email = null;
      state.token = null;
      state.id = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
