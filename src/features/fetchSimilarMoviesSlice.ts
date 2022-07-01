import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_KEY, API_URL } from "../config/config";

export const fetchSimilarMovies = createAsyncThunk("similarMovies/fetchSimilarMovies", async (movieId: Number) => {
  const res = await fetch(`${API_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=ko`);
  const results = await res.json();
  return results.results;
});

export interface SimilarMoviesState {
  similarMovies: [];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: SimilarMoviesState = {
  similarMovies: [],
  loading: "idle",
};

export const similarMoviesSlice = createSlice({
  name: "similarMovies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSimilarMovies.pending.type, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchSimilarMovies.fulfilled.type, (state, action: PayloadAction<[]>) => {
        state.similarMovies = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchSimilarMovies.rejected.type, (state) => {
        state.loading = "failed";
      });
  },
});

export default similarMoviesSlice.reducer;
