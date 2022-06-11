import { configureStore } from "@reduxjs/toolkit";
import userSlice from '../features/userSlice'
import mypageCategorySlice from "../features/mypageCategorySlice";
import searchResultSlice from "../features/searchResultSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    mypageCategory: mypageCategorySlice,
    searchResult: searchResultSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

