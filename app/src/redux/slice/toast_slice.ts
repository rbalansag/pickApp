import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   visible: false,
   color: "",
   message: "",
   icon: "",
};

export const toastSlice = createSlice({
   initialState,
   name: "toast",
   reducers: {
      resetToast: () => initialState,
      setToast: (state, action) => {
         return { ...state, ...action.payload };
      },
      setVisible: (state, action) => {
         state.visible = action.payload
      },
      setColor: (state, action) => {
         state.color = action.payload
      },
      setMessage: (state, action) => {
         state.message = action.payload
      },
      setIcon: (state, action) => {
         state.icon = action.payload
      },
   },
});

export const {
   resetToast,
   setToast,
   setVisible,
   setColor,
   setMessage,
   setIcon,
} = toastSlice.actions;

export const selectToast = (state) => state.toast;

export default toastSlice.reducer;
