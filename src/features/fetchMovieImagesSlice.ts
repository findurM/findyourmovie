import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_KEY, API_URL } from "../config/config";

export const fetchMovieImages = createAsyncThunk("movieImages/fetchMovieImages", async (movieId: Number) => {
  const res = await fetch(`${API_URL}/movie/${movieId}/images?api_key=${API_KEY}`);
  const data = await res.json();

  const isKoPoster = (datas: { iso_639_1: string }) => {
    if (datas.iso_639_1 === "ko") {
      return true;
    }
  };
  const koPoster = data.posters.find(isKoPoster);

  const newImage = [{ movieId: movieId, poster: koPoster ? koPoster.file_path : data.posters[0].file_path }];
  return newImage;
});

export interface MovieImages {
  movieId: Number;
  poster: string;
}

export interface MovieImagesState {
  movieImages: MovieImages[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: MovieImagesState = {
  movieImages: [],
  loading: "idle",
};

export const movieImagesSlice = createSlice({
  name: "movieImages",
  initialState,
  reducers: {
    resetMovieImages: (state) => {
      state.movieImages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieImages.pending.type, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchMovieImages.fulfilled.type, (state, action: PayloadAction<MovieImages[]>) => {
        state.movieImages = [...state.movieImages, ...action.payload];
        state.loading = "succeeded";
      })
      .addCase(fetchMovieImages.rejected.type, (state) => {
        state.loading = "failed";
      });
  },
});

export const { resetMovieImages } = movieImagesSlice.actions;

export default movieImagesSlice.reducer;
