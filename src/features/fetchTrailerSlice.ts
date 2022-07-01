import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_KEY, API_URL } from "../config/config";

export const fetchTrailer = createAsyncThunk("trailer/fetchTrailer", async (movieId: string) => {
  const res = await fetch(`${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const results = await res.json();
  return results.results;
});

interface TrailerInfo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: number | boolean;
  published_at: string;
  id: string;
}

export interface TrailerState {
  trailer: TrailerInfo[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: TrailerState = {
  trailer: [],
  loading: "idle",
};

export const trailerSlice = createSlice({
  name: "trailer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrailer.pending.type, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchTrailer.fulfilled.type, (state, action: PayloadAction<TrailerInfo[]>) => {
        state.trailer = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchTrailer.rejected.type, (state) => {
        state.loading = "failed";
      });
  },
});

export default trailerSlice.reducer;
