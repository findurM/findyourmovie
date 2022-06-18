import { configureStore } from "@reduxjs/toolkit";
import userSlice from '../features/userSlice'
import mypageCategorySlice from "../features/mypageCategorySlice";
import searchResultSlice from "../features/searchResultSlice";
import movieSlice from "../features/movieSlice"
import movieImagesSlice from "../features/fetchMovieImagesSlice";
import userInfoSlice from "../features/fetchUserInfoSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    mypageCategory: mypageCategorySlice,
    searchResult: searchResultSlice,
    currentMovie: movieSlice,
    userInfo: userInfoSlice,
    movieImages: movieImagesSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

