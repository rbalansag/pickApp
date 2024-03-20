import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  log: [],
  active: [],
};

export const logBookSlice = createSlice({
  initialState,
  name: "LogBook",
  reducers: {
    resetLogBook: () => initialState,
    setLogBook: (state, action) => {
      if (action.payload) {
        return { ...state, ...action.payload };
      }
    },
  },
});


export const { resetLogBook, setLogBook } = logBookSlice.actions;

export const selectLogBook = (state) => state.logBook;
export const selectLog = (state) => state.logBook.log;
export const selectActive = (state) => state.logBook.active;

export default logBookSlice.reducer;
