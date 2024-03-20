import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

import toast_slice from "./slice/toast_slice";
import auth_slice from "./slice/auth_slice";
import user_slice from "./slice/user_slice";
import logBook_slice from "./slice/logBook_slice";


const persistConfig = {
   key: "root",
   version: 1,
   storage: AsyncStorage,
};

const reducer = combineReducers({
   toast: toast_slice,
   auth: auth_slice,
   user: user_slice,
   logBook: logBook_slice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
   getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
   }),
});

export let persistor = persistStore(store)