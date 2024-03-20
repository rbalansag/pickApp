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

export const selectUser = (state) => state.user.userData;

export const selectActiveBooking = (state) => state.logBook.activeBooking;

export default userSlice.reducer;
