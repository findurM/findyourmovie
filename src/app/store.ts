import { configureStore } from "@reduxjs/toolkit";
import userSlice from '../features/userSlice'
import mypageCategorySlice from "../features/mypageCategorySlice";
import searchResultSlice from "../features/searchResultSlice";
import movieSlice from "../features/movieSlice"
import movieImagesSlice from "../features/fetchMovieImagesSlice";
import userInfoSlice from "../features/fetchUserInfoSlice";
import movieDetailsSlice from "../features/fetchMovieDetailsSlice";
import actorDetailsSlice from "../features/fetchActorDetailsSlice";
import similarMoviesSlice from "../features/fetchSimilarMoviesSlice";
import recentRecordsSlice from "../features/fetchRecentRecordsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    mypageCategory: mypageCategorySlice,
    searchResult: searchResultSlice,
    currentMovie: movieSlice,
    movieDetails: movieDetailsSlice,
    actorDetails: actorDetailsSlice,
    similarMovies: similarMoviesSlice,
    userInfo: userInfoSlice,
    movieImages: movieImagesSlice,
    recentRecords: recentRecordsSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

