import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const authSlice = createSlice({
  initialState,
  name: "Auth",
  reducers: {
    resetAuth: () => initialState,
    setAuth: (state, action) => {
      if (action.payload) {
        return { ...state, ...action.payload };
      }
    },
  },
});


export const { resetAuth, setAuth } = authSlice.actions;

export const selectAuth = (state) => state.auth.authData;

export default authSlice.reducer;
