import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pool: [],
  active: [],
  completed: [],
};

export const bookingPoolSlice = createSlice({
  initialState,
  name: "BookingPool",
  reducers: {
    resetBookingPool: () => initialState,
    resetActivePool: (state) => {
      state.active = [];
    },
    setBookingPool: (state, action) => {
      if (action.payload) {
        return { ...state, ...action.payload };
      }
    },
  },
});


export const { resetBookingPool, setBookingPool, resetActivePool } = bookingPoolSlice.actions;

export const selectBookingPool = (state) => state.bookingPool.pool;
export const selectActive = (state) => state.bookingPool.active;
export const selectComplete = (state) => state.bookingPool.completed;

export default bookingPoolSlice.reducer;
