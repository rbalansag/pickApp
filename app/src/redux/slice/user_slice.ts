import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  initialState,
  name: "User",
  reducers: {
    resetUser: () => initialState,
    setUser: (state, action) => {
      if (action.payload) {
        return { ...state, ...action.payload };
      }
    },
  },
});


export const { resetUser, setUser } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export const selectUserFullName = (state) => state.user?.user?.FullName;
export const selectUserEmail = (state) => state.user?.user?.EmailAddress;

export default userSlice.reducer;
